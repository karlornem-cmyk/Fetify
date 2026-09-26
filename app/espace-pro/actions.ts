"use server";

import { revalidatePath } from "next/cache";
import { DEPARTMENTS, EVENTS, REQUEST_STATUSES, TRADES } from "@/lib/constants";
import { getOwnProvider } from "@/lib/data";
import {
  type FormState,
  list,
  normalizeUrl,
  positiveInt,
  slugify,
  text,
} from "@/lib/forms";
import { PHOTOS_BUCKET } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const MAX_PHOTOS = 8;
const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");
  return { supabase, user };
}

export async function saveProvider(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user } = await requireUser();

  const name = text(formData, "name", 80);
  const trade = text(formData, "trade");
  const department = text(formData, "department");
  if (name.length < 2) {
    return { status: "error", message: "Indiquez votre nom commercial." };
  }
  if (!(TRADES as readonly string[]).includes(trade)) {
    return { status: "error", message: "Choisissez votre métier." };
  }
  if (!(DEPARTMENTS as readonly string[]).includes(department)) {
    return { status: "error", message: "Choisissez votre département d'activité." };
  }

  const websiteRaw = text(formData, "website", 300);
  const instagramRaw = text(formData, "instagram", 300);
  const website = normalizeUrl(websiteRaw);
  const instagram = normalizeUrl(instagramRaw);
  if ((websiteRaw && !website) || (instagramRaw && !instagram)) {
    return { status: "error", message: "Un des liens saisis n'est pas valide." };
  }

  const fields = {
    name,
    trade,
    department,
    city: text(formData, "city", 80) || null,
    description: text(formData, "description", 2000) || null,
    specialties: text(formData, "specialties", 300)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8),
    events: list(formData, "events").filter((e) =>
      (EVENTS as readonly string[]).includes(e),
    ),
    delivery: text(formData, "delivery") === "oui",
    price_from: positiveInt(formData, "priceFrom"),
    website_url: website,
    instagram_url: instagram,
  };

  const existing = await getOwnProvider(user.id);
  if (existing) {
    const { error } = await supabase
      .from("providers")
      .update(fields)
      .eq("id", existing.id);
    if (error) {
      console.error("saveProvider:update", error);
      return { status: "error", message: "Enregistrement impossible, réessayez." };
    }
  } else {
    const base = slugify(name) || "prestataire";
    let slug = base;
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await supabase
        .from("providers")
        .insert({ ...fields, slug, owner_id: user.id });
      if (!error) break;
      if (error.code !== "23505" || attempt === 4) {
        console.error("saveProvider:insert", error);
        return { status: "error", message: "Création de la fiche impossible, réessayez." };
      }
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    }
  }

  revalidatePath("/espace-pro");
  revalidatePath("/prestataires", "layout");
  return {
    status: "success",
    message: existing
      ? "Fiche enregistrée."
      : "Fiche créée ! Elle sera visible dans l'annuaire après validation par l'équipe Fetify.",
  };
}

export async function uploadPhoto(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user } = await requireUser();
  const provider = await getOwnProvider(user.id);
  if (!provider) {
    return { status: "error", message: "Créez d'abord votre fiche." };
  }
  if (provider.photos.length >= MAX_PHOTOS) {
    return { status: "error", message: `${MAX_PHOTOS} photos maximum.` };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choisissez une photo." };
  }
  const ext = PHOTO_TYPES[file.type];
  if (!ext) {
    return { status: "error", message: "Formats acceptés : JPEG, PNG ou WebP." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { status: "error", message: "La photo dépasse 5 Mo." };
  }

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file, { contentType: file.type });
  if (uploadError) {
    console.error("uploadPhoto", uploadError);
    return { status: "error", message: "Envoi impossible, réessayez." };
  }

  const { error } = await supabase
    .from("providers")
    .update({ photos: [...provider.photos, path] })
    .eq("id", provider.id);
  if (error) {
    await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
    return { status: "error", message: "Envoi impossible, réessayez." };
  }

  revalidatePath("/espace-pro");
  revalidatePath(`/prestataires/${provider.slug}`);
  return { status: "success", message: "Photo ajoutée." };
}

export async function deletePhoto(formData: FormData) {
  const { supabase, user } = await requireUser();
  const provider = await getOwnProvider(user.id);
  const path = text(formData, "path", 300);
  if (!provider || !provider.photos.includes(path)) return;

  await supabase
    .from("providers")
    .update({ photos: provider.photos.filter((p) => p !== path) })
    .eq("id", provider.id);
  await supabase.storage.from(PHOTOS_BUCKET).remove([path]);

  revalidatePath("/espace-pro");
  revalidatePath(`/prestataires/${provider.slug}`);
}

export async function updateRequestStatus(formData: FormData) {
  const { supabase, user } = await requireUser();
  const provider = await getOwnProvider(user.id);
  const requestId = text(formData, "requestId", 36);
  const status = text(formData, "status");
  if (!provider || !(status in REQUEST_STATUSES)) return;

  await supabase
    .from("quote_request_recipients")
    .update({ status })
    .eq("request_id", requestId)
    .eq("provider_id", provider.id);

  revalidatePath("/espace-pro");
}
