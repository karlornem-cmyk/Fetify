import { updateRequestStatus } from "@/app/espace-pro/actions";
import { REQUEST_STATUSES, type RequestStatus, departmentName } from "@/lib/constants";
import type { ReceivedRequest } from "@/lib/data";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });
const shortFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" });

function StatusButton({ requestId, status, label }: { requestId: string; status: RequestStatus; label: string }) {
  return (
    <form action={updateRequestStatus}>
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="status" value={status} />
      <button className="btn btn-ghost btn-small" type="submit">
        {label}
      </button>
    </form>
  );
}

export function RequestList({ requests }: { requests: ReceivedRequest[] }) {
  if (requests.length === 0) {
    return (
      <p className="field-note">
        Aucune demande pour l&apos;instant. Elles apparaîtront ici dès qu&apos;un organisateur de
        votre département cherchera votre métier.
      </p>
    );
  }

  return (
    <div>
      {requests.map(({ status, created_at, request: r }) => (
        <details className="request" key={r.id}>
          <summary>
            <span>
              <span className="request-title">
                {r.event_type} · {r.first_name} {r.last_name.charAt(0)}.
              </span>
              <br />
              <span className="request-sub">
                {r.event_date ? dateFmt.format(new Date(r.event_date)) : "Date à définir"} ·{" "}
                {r.city ?? departmentName(r.department)} · reçue le {shortFmt.format(new Date(created_at))}
                {r.target_provider_id && " · demande directe"}
              </span>
            </span>
            <span className={`status-pill status-${status}`}>{REQUEST_STATUSES[status]}</span>
          </summary>
          <dl>
            <dt>Contact</dt>
            <dd>
              {r.first_name} {r.last_name}
            </dd>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${r.email}`}>{r.email}</a>
            </dd>
            {r.phone && (
              <>
                <dt>Téléphone</dt>
                <dd>
                  <a href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a>
                </dd>
              </>
            )}
            <dt>Lieu</dt>
            <dd>{[r.city, r.department].filter(Boolean).join(" · ")}</dd>
            {r.guests != null && (
              <>
                <dt>Invités</dt>
                <dd>{r.guests}</dd>
              </>
            )}
            {r.budget != null && (
              <>
                <dt>Budget</dt>
                <dd>{r.budget.toLocaleString("fr-FR")} €</dd>
              </>
            )}
            {r.trades.length > 0 && (
              <>
                <dt>Recherche</dt>
                <dd>{r.trades.join(", ")}</dd>
              </>
            )}
            {r.message && (
              <>
                <dt>Message</dt>
                <dd className="profile-desc">{r.message}</dd>
              </>
            )}
          </dl>
          <div className="request-actions">
            {status === "nouvelle" && <StatusButton requestId={r.id} status="vue" label="Marquer comme vue" />}
            {status !== "repondue" && <StatusButton requestId={r.id} status="repondue" label="J'ai répondu" />}
            {status !== "declinee" && <StatusButton requestId={r.id} status="declinee" label="Décliner" />}
          </div>
        </details>
      ))}
    </div>
  );
}
