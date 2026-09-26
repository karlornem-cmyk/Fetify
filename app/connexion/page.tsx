import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/AuthForms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Connexion prestataire" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const { suite, erreur } = await searchParams;
  if (isSupabaseConfigured && (await getUser())) redirect("/espace-pro");

  return (
    <div className="page-body">
      <div className="card narrower">
        <p className="eyebrow">Espace pro</p>
        <h1 style={{ fontSize: "1.9rem", margin: "8px 0 24px" }}>Connexion</h1>
        {erreur === "lien" && (
          <p className="notice">Ce lien de confirmation a expiré ou a déjà été utilisé. Connectez-vous ou recréez un compte.</p>
        )}
        <SignInForm next={typeof suite === "string" ? suite : undefined} />
        <p className="field-note" style={{ marginTop: 18 }}>
          Pas encore de compte ? <Link href="/inscription">Créer un compte prestataire</Link>
        </p>
      </div>
    </div>
  );
}
