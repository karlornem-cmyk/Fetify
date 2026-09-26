import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ProviderCard";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { departmentName } from "@/lib/constants";
import { getProviderBySlug } from "@/lib/data";
import { photoUrl } from "@/lib/supabase/config";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const provider = await getProviderBySlug((await params).slug);
  if (!provider) return {};
  return {
    title: `${provider.name} — ${provider.trade}`,
    description:
      provider.description?.slice(0, 160) ??
      `${provider.trade} · ${departmentName(provider.department)}`,
  };
}

export default async function ProviderPage({ params }: { params: Params }) {
  const provider = await getProviderBySlug((await params).slug);
  if (!provider) notFound();

  return (
    <div className="page-body">
      {!provider.published && (
        <p className="notice">
          Aperçu : votre fiche n&apos;est pas encore publiée. Elle sera visible de tous après
          validation par l&apos;équipe Fetify.
        </p>
      )}
      <div className="profile">
        <div>
          <div className="profile-top">
            <Avatar provider={provider} />
            <div>
              <p className="dir-job" style={{ margin: 0 }}>
                {provider.trade}
              </p>
              <h1 style={{ fontSize: "clamp(1.9rem, 2vw + 1.2rem, 2.8rem)" }}>{provider.name}</h1>
            </div>
          </div>

          <div className="profile-meta">
            <span>{[provider.city, departmentName(provider.department)].filter(Boolean).join(" · ")}</span>
            {provider.price_from != null && (
              <span>À partir de {provider.price_from.toLocaleString("fr-FR")} €</span>
            )}
            {provider.delivery && <span>Livraison possible</span>}
            {provider.featured && <span className="badge-featured">★ Mise en avant</span>}
          </div>

          {provider.specialties.length + provider.events.length > 0 && (
            <div className="dir-tags" style={{ marginBottom: 20 }}>
              {provider.specialties.map((s) => (
                <span className="chip" key={`s-${s}`}>
                  {s}
                </span>
              ))}
              {provider.events.map((e) => (
                <span className="chip" key={`e-${e}`}>
                  {e}
                </span>
              ))}
            </div>
          )}

          {provider.description && <p className="profile-desc">{provider.description}</p>}

          {(provider.website_url || provider.instagram_url) && (
            <p className="links">
              {provider.website_url && (
                <a href={provider.website_url} target="_blank" rel="noopener noreferrer nofollow">
                  Site web
                </a>
              )}
              {provider.instagram_url && (
                <a href={provider.instagram_url} target="_blank" rel="noopener noreferrer nofollow">
                  Instagram
                </a>
              )}
            </p>
          )}

          {provider.photos.length > 0 && (
            <div className="gallery">
              {provider.photos.map((path) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={path} src={photoUrl(path)} alt={`Réalisation de ${provider.name}`} loading="lazy" />
              ))}
            </div>
          )}
        </div>

        {provider.published && (
        <aside className="card profile-aside">
          <h2>Demander un devis</h2>
          <QuoteRequestForm
            provider={{
              id: provider.id,
              slug: provider.slug,
              department: provider.department,
              events: provider.events,
            }}
          />
        </aside>
        )}
      </div>
    </div>
  );
}
