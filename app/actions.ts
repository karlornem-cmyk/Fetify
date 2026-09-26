"use server";

import { redirect } from "next/navigation";
import { DEPARTMENTS, EVENTS, TRADES } from "@/lib/constants";
import {
  type FormState,
  isEmail,
  list,
  normalizeUrl,
  positiveInt,
  text,
} from "@/lib/forms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const UNAVAILABLE: FormState = {
  status: "error",
  message:
    "Service momentanément indisponible — écrivez-nous à bonjour@fetify.fr.",
};

export async function joinWaitlist(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const kind = text(formData, "kind");
  const email = text(formData, "email");

  let row: Record<string, unknown>;
  if (kind === "client") {
    const firstName = text(formData, "firstName");
    const lastName = text(formData, "lastName");
    const phone = text(formData, "phone", 30);
    if (!firstName || !lastName || !isEmail(email) || !phone) {
      return {
        status: "error",
        message: "Merci de renseigner votre nom, prénom, email et téléphone.",
      };
    }
    const postalCode = text(formData, "postalCode", 5);
    if (postalCode && !/^[0-9]{5}$/.test(postalCode)) {
      return { status: "error", message: "Le code postal doit comporter 5 chiffres." };
    }
    row = {
      kind,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      postal_code: postalCode || null,
      event_type: text(formData, "event") || null,
      venue: text(formData, "venue") || null,
      guests: positiveInt(formData, "guests"),
    };
  } else if (kind === "prestataire") {
    const businessName = text(formData, "name");
    if (!businessName || !isEmail(email)) {
      return {
        status: "error",
        message: "Merci de renseigner votre nom commercial et votre email.",
      };
    }
    const delivery = text(formData, "delivery");
    row = {
      kind,
      business_name: businessName,
      email,
      trade: text(formData, "job") || null,
      department: text(formData, "department") || null,
      events: list(formData, "events").filter((e) =>
        (EVENTS as readonly string[]).includes(e),
      ),
      delivery: delivery === "Oui" ? true : delivery === "Non" ? false : null,
      portfolio_url: normalizeUrl(text(formData, "portfolio", 500)),
    };
  } else {
    return { status: "error", message: "Formulaire invalide." };
  }

  if (!isSupabaseConfigured) return UNAVAILABLE;
  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_signups").insert(row);
  if (error) {
    console.error("joinWaitlist", error);
    return { status: "error", message: "Un souci est survenu, réessayez dans un instant." };
  }

  return {
    status: "success",
    message:
      kind === "prestataire"
        ? `Merci, ${row.business_name}. Votre profil est en cours d'examen — on vous recontacte dès sa validation.`
        : `Merci, ${row.first_name}. Vous êtes sur la liste.`,
  };
}

export async function submitQuoteRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const eventType = text(formData, "eventType");
  const department = text(formData, "department");
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const email = text(formData, "email");
  const eventDate = text(formData, "eventDate", 10);
  const targetProviderId = text(formData, "providerId", 36) || null;
  const targetSlug = text(formData, "providerSlug", 60);

  if (!(EVENTS as readonly string[]).includes(eventType)) {
    return { status: "error", message: "Choisissez un type d'événement." };
  }
  if (!(DEPARTMENTS as readonly string[]).includes(department)) {
    return { status: "error", message: "Choisissez le département de l'événement." };
  }
  if (!firstName || !lastName || !isEmail(email)) {
    return {
      status: "error",
      message: "Merci de renseigner vos nom, prénom et une adresse email valide.",
    };
  }
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    return { status: "error", message: "Date d'événement invalide." };
  }

  if (!isSupabaseConfigured) return UNAVAILABLE;
  const supabase = await createClient();
  const { data: matches, error } = await supabase.rpc("submit_quote_request", {
    p_event_type: eventType,
    p_event_date: eventDate || null,
    p_department: department,
    p_city: text(formData, "city"),
    p_guests: positiveInt(formData, "guests"),
    p_budget: positiveInt(formData, "budget"),
    p_trades: list(formData, "trades").filter((t) =>
      (TRADES as readonly string[]).includes(t),
    ),
    p_message: text(formData, "message", 3000),
    p_first_name: firstName,
    p_last_name: lastName,
    p_email: email,
    p_phone: text(formData, "phone", 30),
    p_target_provider_id: targetProviderId,
  });

  if (error) {
    console.error("submitQuoteRequest", error);
    return { status: "error", message: "Un souci est survenu, réessayez dans un instant." };
  }

  const params = new URLSearchParams({ n: String(matches ?? 0) });
  if (targetSlug) params.set("prestataire", targetSlug);
  redirect(`/demande/merci?${params}`);
}
