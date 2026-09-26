import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";

export async function SiteHeader() {
  const user = isSupabaseConfigured ? await getUser() : null;

  return (
    <header className="nav">
      <Link className="brand" href="/">
        Fetify
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/#evenements">Événements</Link>
        </li>
        <li>
          <Link href="/#comment">Comment ça marche</Link>
        </li>
        <li>
          <Link href="/prestataires">Annuaire</Link>
        </li>
      </ul>
      <div className="nav-actions">
        {user ? (
          <Link className="nav-link-quiet" href="/espace-pro">
            Espace pro
          </Link>
        ) : (
          <Link className="nav-link-quiet" href="/connexion">
            Connexion<span className="hide-sm"> pro</span>
          </Link>
        )}
        <Link className="btn btn-primary btn-small" href="/demande">
          Demander<span className="hide-sm"> des</span> devis
        </Link>
      </div>
    </header>
  );
}
