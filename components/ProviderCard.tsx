import Link from "next/link";
import { departmentName } from "@/lib/constants";
import type { Provider } from "@/lib/data";

const ACCENTS: Record<string, string> = {
  "Pâtissier": "var(--sage)",
  "Traiteur": "var(--sage)",
  "Bar à cocktails": "var(--plum)",
  "DJ": "var(--plum)",
  "Photobooth": "var(--plum)",
  "Wedding planner": "var(--berry)",
  "Fleuriste": "var(--berry)",
  "Lieu de réception": "var(--berry)",
};

export function accentFor(trade: string): string {
  return ACCENTS[trade] ?? "var(--gold)";
}

export function Avatar({ provider }: { provider: Pick<Provider, "name" | "trade"> }) {
  return (
    <span
      className="dir-avatar"
      style={{ "--accent": accentFor(provider.trade) } as React.CSSProperties}
      aria-hidden="true"
    >
      {provider.name.charAt(0).toUpperCase()}
    </span>
  );
}

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link
      className="dir-card dir-card-link"
      href={`/prestataires/${provider.slug}`}
      style={{ "--accent": accentFor(provider.trade) } as React.CSSProperties}
    >
      <div className="dir-top">
        <Avatar provider={provider} />
        <div>
          <p className="dir-name">{provider.name}</p>
          <p className="dir-job">{provider.trade}</p>
        </div>
      </div>
      <p className="dir-city">
        {[provider.city, departmentName(provider.department)]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {provider.specialties.length > 0 && (
        <div className="dir-tags">
          {provider.specialties.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
      )}
      {provider.featured && <span className="badge-featured">★ Mise en avant</span>}
    </Link>
  );
}
