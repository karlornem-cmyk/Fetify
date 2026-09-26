import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";

export const metadata: Metadata = {
  title: "Demander des devis",
  description: "Décrivez votre événement et recevez des devis de prestataires près de chez vous.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function QuoteRequestPage({ searchParams }: { searchParams: SearchParams }) {
  const { evenement } = await searchParams;

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Demande de devis</p>
        <h1>Décrivez votre événement</h1>
        <p>
          Deux minutes suffisent. Votre demande est transmise aux prestataires disponibles dans
          votre département, qui vous recontactent directement.
        </p>
      </div>
      <div className="page-body">
        <div className="card narrow">
          <QuoteRequestForm defaultEvent={typeof evenement === "string" ? evenement : undefined} />
        </div>
      </div>
    </>
  );
}
