"use client";

import { useActionState } from "react";
import { submitQuoteRequest } from "@/app/actions";
import { EVENTS, TRADES } from "@/lib/constants";
import { initialFormState } from "@/lib/forms";
import { FormMessage } from "./FormMessage";
import { DepartmentOptions, EventOptions } from "./Options";
import { SubmitButton } from "./SubmitButton";

type Props = {
  /** Demande adressée à un seul prestataire (depuis sa fiche). */
  provider?: { id: string; slug: string; department: string; events: string[] };
  defaultEvent?: string;
};

export function QuoteRequestForm({ provider, defaultEvent }: Props) {
  const [state, action] = useActionState(submitQuoteRequest, initialFormState);
  const today = new Date().toISOString().slice(0, 10);
  const eventDefault =
    defaultEvent && (EVENTS as readonly string[]).includes(defaultEvent)
      ? defaultEvent
      : provider?.events[0] ?? "";

  return (
    <form action={action}>
      {provider && (
        <>
          <input type="hidden" name="providerId" value={provider.id} />
          <input type="hidden" name="providerSlug" value={provider.slug} />
        </>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="q-event">Type d&apos;événement</label>
          <select id="q-event" name="eventType" required defaultValue={eventDefault}>
            <option value="" disabled>
              Sélectionner…
            </option>
            <EventOptions />
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-date">Date</label>
          <input id="q-date" name="eventDate" type="date" min={today} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="q-department">Département</label>
          <select id="q-department" name="department" required defaultValue={provider?.department ?? ""}>
            <option value="" disabled>
              Sélectionner…
            </option>
            <DepartmentOptions />
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-city">Ville ou lieu</label>
          <input id="q-city" name="city" type="text" placeholder="Ville, nom du lieu…" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="q-guests">Nombre d&apos;invités</label>
          <input id="q-guests" name="guests" type="number" min={1} step={1} inputMode="numeric" />
        </div>
        <div className="field">
          <label htmlFor="q-budget">Budget indicatif (€)</label>
          <input id="q-budget" name="budget" type="number" min={1} step={50} inputMode="numeric" />
        </div>
      </div>

      {!provider && (
        <fieldset className="field field-events">
          <legend>
            Prestataires recherchés <span className="field-hint">(laisser vide = tous)</span>
          </legend>
          <div className="checks">
            {TRADES.filter((t) => t !== "Autre").map((t) => (
              <label className="check" key={t}>
                <input type="checkbox" name="trades" value={t} /> {t}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="field">
        <label htmlFor="q-message">Votre projet</label>
        <textarea
          id="q-message"
          name="message"
          maxLength={3000}
          placeholder="Ambiance, contraintes, ce qui compte pour vous…"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="q-first-name">Prénom</label>
          <input id="q-first-name" name="firstName" type="text" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="q-last-name">Nom</label>
          <input id="q-last-name" name="lastName" type="text" autoComplete="family-name" required />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="q-email">Email</label>
          <input id="q-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="q-phone">Téléphone</label>
          <input id="q-phone" name="phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" />
        </div>
      </div>
      <p className="field-note" style={{ marginBottom: 16 }}>
        Vos coordonnées ne sont transmises qu&apos;aux prestataires qui reçoivent votre demande.
      </p>

      <SubmitButton>{provider ? "Envoyer ma demande" : "Recevoir des devis"}</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
