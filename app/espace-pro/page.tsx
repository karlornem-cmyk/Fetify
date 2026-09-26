import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { PhotoManager } from "@/components/PhotoManager";
import { ProviderProfileForm } from "@/components/ProviderProfileForm";
import { RequestList } from "@/components/RequestList";
import { getOwnProvider, listReceivedRequests } from "@/lib/data";
import { isSupabaseConfigured, photoUrl } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Espace pro", robots: { index: false } };

export default async function DashboardPage() {
  if (!isSupabaseConfigured) redirect("/connexion");
  const user = await getUser();
  if (!user) redirect("/connexion?suite=/espace-pro");

  const provider = await getOwnProvider(user.id);
  const requests = provider ? await listReceivedRequests(provider.id) : [];
  const newCount = requests.filter((r) => r.status === "nouvelle").length;

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Espace pro</p>
        <h1>{provider ? provider.name : "Bienvenue sur Fetify"}</h1>
        <div className="request-sub" style={{ marginTop: 12 }}>
          Connecté·e en tant que {user.email} ·{" "}
          <form action={signOut} style={{ display: "inline" }}>
            <button className="btn-link" type="submit">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>

      <div className="page-body">
        {!provider ? (
          <div className="card narrow">
            <h2>Créez votre fiche</h2>
            <p className="field-note" style={{ marginBottom: 20 }}>
              Ces informations apparaîtront dans l&apos;annuaire et servent à vous adresser les
              demandes qui vous correspondent.
            </p>
            <ProviderProfileForm provider={null} />
          </div>
        ) : (
          <>
            <p className="notice">
              {provider.published ? (
                <>
                  Votre fiche est en ligne :{" "}
                  <Link href={`/prestataires/${provider.slug}`}>voir ma fiche publique</Link>.
                </>
              ) : (
                <>
                  Votre fiche est en attente de validation par l&apos;équipe Fetify. Vous recevrez
                  des demandes dès sa publication ·{" "}
                  <Link href={`/prestataires/${provider.slug}`}>aperçu</Link>
                </>
              )}
            </p>
            <div className="dash-grid">
              <div className="card">
                <h2>
                  Demandes reçues{newCount > 0 && ` (${newCount} nouvelle${newCount > 1 ? "s" : ""})`}
                </h2>
                <RequestList requests={requests} />
              </div>
              <div>
                <div className="card">
                  <h2>Ma fiche</h2>
                  <ProviderProfileForm provider={provider} />
                </div>
                <div className="card">
                  <h2>Photos</h2>
                  <PhotoManager photos={provider.photos} urls={provider.photos.map(photoUrl)} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
