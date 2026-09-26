import type { Metadata } from "next";
import Link from "next/link";
import { DepartmentOptions, EventOptions, TradeOptions } from "@/components/Options";
import { ProviderCard } from "@/components/ProviderCard";
import { listProviders } from "@/lib/data";

export const metadata: Metadata = {
  title: "Annuaire des prestataires",
  description: "Traiteurs, photographes, DJ, pâtissiers… les prestataires Fetify près de chez vous.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function param(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function ProvidersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = {
    trade: param(sp.metier),
    department: param(sp.departement),
    event: param(sp.evenement),
  };
  const providers = await listProviders(filters);
  const filtered = Boolean(filters.trade || filters.department || filters.event);

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Annuaire</p>
        <h1>Les prestataires du carnet</h1>
        <p>Chaque fiche est vérifiée par l&apos;équipe avant publication.</p>
      </div>

      <div className="page-body">
        <form className="filters" method="get">
          <div className="field">
            <label htmlFor="f-trade">Métier</label>
            <select id="f-trade" name="metier" defaultValue={filters.trade}>
              <option value="">Tous les métiers</option>
              <TradeOptions />
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-department">Département</label>
            <select id="f-department" name="departement" defaultValue={filters.department}>
              <option value="">Tous les départements</option>
              <DepartmentOptions />
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-event">Événement</label>
            <select id="f-event" name="evenement" defaultValue={filters.event}>
              <option value="">Tous les événements</option>
              <EventOptions />
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Filtrer
          </button>
        </form>

        {providers.length > 0 ? (
          <div className="dir-grid">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <p className="empty">
            {filtered ? (
              <>
                Aucun prestataire ne correspond encore à ces critères.{" "}
                <Link href="/prestataires">Voir tout l&apos;annuaire</Link> ou{" "}
                <Link href="/demande">déposez une demande</Link> : nous vous recontactons.
              </>
            ) : (
              "Les premières fiches arrivent très bientôt."
            )}
          </p>
        )}
      </div>
    </>
  );
}
