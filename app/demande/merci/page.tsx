import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Demande envoyée" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ThanksPage({ searchParams }: { searchParams: SearchParams }) {
  const { n, prestataire } = await searchParams;
  const count = Number.parseInt(typeof n === "string" ? n : "0", 10) || 0;

  let message: string;
  if (typeof prestataire === "string") {
    message = "Votre demande a bien été transmise. Le prestataire vous recontacte directement.";
  } else if (count > 0) {
    message = `Votre demande a été transmise à ${count} prestataire${count > 1 ? "s" : ""} près de chez vous. Ils vous recontactent directement par email ou téléphone.`;
  } else {
    message =
      "Votre demande est bien enregistrée. Aucun prestataire ne couvre encore exactement ces critères : l'équipe Fetify vous recontacte avec une sélection.";
  }

  return (
    <div className="page-body">
      <div className="card narrow" style={{ textAlign: "center" }}>
        <p className="eyebrow">Demande envoyée</p>
        <h1 style={{ fontSize: "2rem", margin: "10px 0 16px" }}>Merci !</h1>
        <p className="thanks">{message}</p>
        <p style={{ marginTop: 24 }}>
          <Link className="btn btn-ghost" href="/prestataires">
            Parcourir l&apos;annuaire
          </Link>
        </p>
      </div>
    </div>
  );
}
