import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/AuthForms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Devenir prestataire",
  description: "Créez votre fiche Fetify et recevez des demandes qualifiées, sans démarchage.",
};

export default async function SignUpPage() {
  if (isSupabaseConfigured && (await getUser())) redirect("/espace-pro");

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Prestataires</p>
        <h1>Rejoignez le carnet Fetify</h1>
        <p>
          Créez votre compte, complétez votre fiche et recevez des demandes filtrées par métier,
          département et type d&apos;événement. Gratuit pour démarrer.
        </p>
      </div>
      <div className="page-body">
        <div className="card narrower">
          <h2>Créer mon compte</h2>
          <SignUpForm />
          <p className="field-note" style={{ marginTop: 18 }}>
            Déjà inscrit·e ? <Link href="/connexion">Se connecter</Link>
          </p>
        </div>
      </div>
    </>
  );
}
