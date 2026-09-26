"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type FormState, isEmail, text } from "@/lib/forms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const UNAVAILABLE: FormState = {
  status: "error",
  message: "Les comptes ne sont pas encore activés sur ce site.",
};

/** N'accepte que des chemins internes, pour éviter les redirections ouvertes. */
function safeNext(value: string): string {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/espace-pro";
}

async function siteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signUp(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email");
  const password = text(formData, "password", 200);

  if (!isEmail(email)) {
    return { status: "error", message: "Adresse email invalide." };
  }
  if (password.length < 8) {
    return {
      status: "error",
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    };
  }
  if (!isSupabaseConfigured) return UNAVAILABLE;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await siteUrl()}/auth/confirm?next=/espace-pro` },
  });

  if (error) {
    console.error("signUp", error);
    return {
      status: "error",
      message:
        error.code === "weak_password"
          ? "Mot de passe trop faible, choisissez-en un plus long."
          : "Impossible de créer le compte pour le moment.",
    };
  }

  // Confirmation d'email désactivée côté Supabase : session ouverte directement.
  if (data.session) redirect("/espace-pro");

  return {
    status: "success",
    message: `Un email de confirmation vient d'être envoyé à ${email}. Cliquez sur le lien pour activer votre compte.`,
  };
}

export async function signIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email");
  const password = text(formData, "password", 200);
  if (!email || !password) {
    return { status: "error", message: "Renseignez votre email et votre mot de passe." };
  }
  if (!isSupabaseConfigured) return UNAVAILABLE;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      status: "error",
      message:
        error.code === "email_not_confirmed"
          ? "Confirmez d'abord votre adresse email grâce au lien reçu."
          : "Email ou mot de passe incorrect.",
    };
  }

  redirect(safeNext(text(formData, "next", 200)));
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
