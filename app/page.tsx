import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { WaitlistForms } from "@/components/WaitlistForms";
import { listFeaturedProviders } from "@/lib/data";

export default async function HomePage() {
  const providers = await listFeaturedProviders(4);

  return (
    <>
      <section className="hero" id="top">
        <div>
          <p className="eyebrow">On s&apos;occupe du reste</p>
          <h1>Fetify</h1>
          <p className="lede">
            La mise en relation avec les prestataires de vos mariages, baptêmes, anniversaires et
            soirées entre proches — un seul formulaire, les bons contacts près de chez vous.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/demande">
              Je prépare un événement
            </Link>
            <Link className="btn btn-ghost" href="/inscription">
              Je suis prestataire
            </Link>
          </div>
        </div>
        <div className="invite" aria-hidden="true">
          <span className="seal">F</span>
          <p className="kicker">Vos prestataires, sélectionnés</p>
          <p className="title">Mariage · 12 juin</p>
          <div className="matches">
            <div className="match-row"><span>Traiteur — Table &amp; Or</span><span>Disponible</span></div>
            <div className="match-row"><span>Photographe — L. Moreau</span><span>Disponible</span></div>
            <div className="match-row"><span>DJ — Nuits Blanches</span><span>Sur devis</span></div>
          </div>
        </div>
      </section>

      <section className="categories" id="evenements">
        <div className="section-head">
          <p className="eyebrow">Pour quel événement</p>
          <h2>Un format de mise en relation par occasion</h2>
          <p>Chaque événement a ses codes et ses prestataires. Fetify adapte la sélection au vôtre.</p>
        </div>
        <div className="cat-grid">
          <article className="cat-card cat-mariage">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="16" cy="21" r="9.5"/><circle cx="24" cy="21" r="9.5"/></svg>
            <h3><Link href={{ pathname: "/demande", query: { evenement: "Mariage" } }} style={{ textDecoration: "none" }}>Mariage</Link></h3>
            <p>Du lieu de réception au dernier détail de la soirée.</p>
            <div className="chips">
              <span className="chip">Traiteur</span><span className="chip">Photographe</span><span className="chip">DJ</span><span className="chip">Fleuriste</span><span className="chip">Lieu de réception</span>
            </div>
          </article>
          <article className="cat-card cat-bapteme">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 7c5 8 9 12.5 9 17a9 9 0 1 1-18 0c0-4.5 4-9 9-17Z"/></svg>
            <h3><Link href={{ pathname: "/demande", query: { evenement: "Baptême & communion" } }} style={{ textDecoration: "none" }}>Baptême &amp; communion</Link></h3>
            <p>Une cérémonie sobre, une réception à la hauteur du moment.</p>
            <div className="chips">
              <span className="chip">Traiteur</span><span className="chip">Photographe</span><span className="chip">Pâtissier</span><span className="chip">Décoration</span>
            </div>
          </article>
          <article className="cat-card cat-anniversaire">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="17" y="16" width="6" height="18" rx="1.5"/><path d="M20 6c2.5 3.5 3.5 5.6 3.5 7.2a3.5 3.5 0 1 1-7 0c0-1.6 1-3.7 3.5-7.2Z"/></svg>
            <h3><Link href={{ pathname: "/demande", query: { evenement: "Anniversaire" } }} style={{ textDecoration: "none" }}>Anniversaire</Link></h3>
            <p>Des 18 ans aux noces d&apos;or, toutes les échelles de fête.</p>
            <div className="chips">
              <span className="chip">Traiteur</span><span className="chip">DJ</span><span className="chip">Décoration</span><span className="chip">Location de salle</span>
            </div>
          </article>
          <article className="cat-card cat-soiree">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6">
              <g transform="rotate(-18 15 20)"><path d="M10 8h10l-5 9v11M9.5 28.5h11"/></g>
              <g transform="rotate(18 25 20)"><path d="M20 8h10l-5 9v11M19.5 28.5h11"/></g>
            </svg>
            <h3><Link href={{ pathname: "/demande", query: { evenement: "Soirée entre proches" } }} style={{ textDecoration: "none" }}>Soirée entre proches</Link></h3>
            <p>Entre amis ou en famille, sans rien organiser vous-même.</p>
            <div className="chips">
              <span className="chip">Traiteur</span><span className="chip">Bar à cocktails</span><span className="chip">Photobooth</span><span className="chip">Location</span>
            </div>
          </article>
        </div>
      </section>

      <section className="how" id="comment">
        <div className="section-head">
          <p className="eyebrow">Comment ça marche</p>
          <h2>Trois étapes, aucun appel à froid</h2>
        </div>
        <div className="steps">
          <div className="step">
            <span className="num">01</span>
            <h3>Décrivez votre événement</h3>
            <p>Date, ville, budget et style — deux minutes suffisent.</p>
          </div>
          <div className="step">
            <span className="num">02</span>
            <h3>Recevez une sélection</h3>
            <p>Des prestataires disponibles et notés, choisis pour votre demande.</p>
          </div>
          <div className="step">
            <span className="num">03</span>
            <h3>Comparez et réservez</h3>
            <p>Échangez directement, comparez les devis, réservez en confiance.</p>
          </div>
        </div>
      </section>

      <section className="audiences" id="pour-qui">
        <div className="section-head">
          <p className="eyebrow">Pour qui</p>
          <h2>Deux côtés d&apos;un même carnet</h2>
        </div>
        <div className="aud-grid">
          <div className="aud-card">
            <p className="eyebrow" style={{ color: "var(--berry)" }}>Organisateurs</p>
            <h3>Un formulaire, plusieurs devis</h3>
            <ul>
              <li>Une seule demande envoyée aux bons prestataires de votre ville</li>
              <li>Des profils avec avis, photos et disponibilités réelles</li>
              <li>Aucune démarche imposée : vous choisissez qui recontacter</li>
            </ul>
          </div>
          <div className="aud-card">
            <p className="eyebrow" style={{ color: "var(--plum)" }}>Prestataires</p>
            <h3>Des demandes qualifiées, sans démarchage</h3>
            <ul>
              <li>Des demandes filtrées par métier, ville et type d&apos;événement</li>
              <li>Une fiche pour présenter votre travail et vos disponibilités</li>
              <li>Pas d&apos;abonnement obligatoire pour démarrer</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="directory" id="annuaire">
        <div className="section-head">
          <p className="eyebrow">Déjà avec nous</p>
          <h2>Les premiers noms du carnet</h2>
          <p>
            Une sélection validée à la main, pour l&apos;instant en Île-de-France — l&apos;annuaire
            s&apos;agrandit chaque semaine.
          </p>
        </div>
        {providers.length > 0 ? (
          <div className="dir-grid">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <p className="empty">Les premières fiches arrivent très bientôt.</p>
        )}
        <p className="directory-note">
          <Link href="/prestataires">Voir tout l&apos;annuaire</Link> · Prestataire ?{" "}
          <Link href="/inscription">Rejoignez le carnet</Link> — c&apos;est gratuit pour démarrer.
        </p>
      </section>

      <section className="signup" id="inscription">
        <div className="section-head" style={{ textAlign: "center", marginInline: "auto" }}>
          <p className="eyebrow">Accès anticipé</p>
          <h2>Réservez votre place</h2>
          <p>
            Fetify ouvre prochainement. Laissez vos coordonnées pour être prévenu·e en priorité.
          </p>
        </div>
        <WaitlistForms />
      </section>
    </>
  );
}
