"use client";

import { useActionState, useState } from "react";
import { joinWaitlist } from "@/app/actions";
import { EVENTS } from "@/lib/constants";
import { initialFormState } from "@/lib/forms";
import { FormMessage } from "./FormMessage";
import { DepartmentOptions, TradeOptions } from "./Options";
import { SubmitButton } from "./SubmitButton";

export function WaitlistForms() {
  const [tab, setTab] = useState<"client" | "pro">("client");
  const [clientState, clientAction] = useActionState(joinWaitlist, initialFormState);
  const [proState, proAction] = useActionState(joinWaitlist, initialFormState);

  return (
    <div className="signup-card">
      <div className="tabs" role="tablist">
        <button
          className="tab"
          id="tab-client"
          role="tab"
          type="button"
          aria-selected={tab === "client"}
          aria-controls="panel-client"
          onClick={() => setTab("client")}
        >
          J&apos;organise un événement
        </button>
        <button
          className="tab"
          id="tab-pro"
          role="tab"
          type="button"
          aria-selected={tab === "pro"}
          aria-controls="panel-pro"
          onClick={() => setTab("pro")}
        >
          Je suis prestataire
        </button>
      </div>

      <form id="panel-client" role="tabpanel" aria-labelledby="tab-client" action={clientAction} hidden={tab !== "client"}>
        <input type="hidden" name="kind" value="client" />
        <fieldset disabled={clientState.status === "success"} style={{ border: 0, padding: 0, margin: 0 }}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="client-first-name">Prénom</label>
              <input id="client-first-name" name="firstName" type="text" autoComplete="given-name" required />
            </div>
            <div className="field">
              <label htmlFor="client-last-name">Nom</label>
              <input id="client-last-name" name="lastName" type="text" autoComplete="family-name" required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="client-email">Email</label>
              <input id="client-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="client-phone">Téléphone</label>
              <input id="client-phone" name="phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" required />
            </div>
          </div>
          <p className="field-note">Ces informations nous aident à vous mettre en relation avec les bons prestataires.</p>
          <div className="field-row">
            <div className="field">
              <label htmlFor="client-postal">Code postal</label>
              <input id="client-postal" name="postalCode" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} autoComplete="postal-code" placeholder="75001" />
            </div>
            <div className="field">
              <label htmlFor="client-event">Type d&apos;événement</label>
              <select id="client-event" name="event">
                {EVENTS.map((e) => (
                  <option key={e}>{e}</option>
                ))}
                <option>Autre</option>
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="client-venue">Lieu de l&apos;événement</label>
              <input id="client-venue" name="venue" type="text" placeholder="Nom du lieu, ville…" />
            </div>
            <div className="field">
              <label htmlFor="client-guests">Nombre d&apos;invités</label>
              <input id="client-guests" name="guests" type="number" min={1} step={1} inputMode="numeric" />
            </div>
          </div>
          <SubmitButton>Rejoindre la liste</SubmitButton>
        </fieldset>
        <FormMessage state={clientState} />
      </form>

      <form id="panel-pro" role="tabpanel" aria-labelledby="tab-pro" action={proAction} hidden={tab !== "pro"}>
        <input type="hidden" name="kind" value="prestataire" />
        <fieldset disabled={proState.status === "success"} style={{ border: 0, padding: 0, margin: 0 }}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="pro-name">Nom commercial</label>
              <input id="pro-name" name="name" type="text" autoComplete="organization" required />
            </div>
            <div className="field">
              <label htmlFor="pro-email">Email</label>
              <input id="pro-email" name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="pro-job">Métier</label>
              <select id="pro-job" name="job">
                <TradeOptions />
              </select>
            </div>
            <div className="field">
              <label htmlFor="pro-department">Département d&apos;activité</label>
              <select id="pro-department" name="department" defaultValue="">
                <option value="">Sélectionner…</option>
                <DepartmentOptions />
              </select>
            </div>
          </div>
          <fieldset className="field field-events">
            <legend>
              Événements que vous couvrez <span className="field-hint">(plusieurs choix possibles)</span>
            </legend>
            <div className="checks">
              {EVENTS.map((e) => (
                <label className="check" key={e}>
                  <input type="checkbox" name="events" value={e} /> {e}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="field field-events">
            <legend>Livraison</legend>
            <div className="checks">
              <label className="check">
                <input type="radio" name="delivery" value="Oui" /> Oui
              </label>
              <label className="check">
                <input type="radio" name="delivery" value="Non" /> Non
              </label>
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="pro-portfolio">Photos &amp; vidéos de votre travail</label>
            <input id="pro-portfolio" name="portfolio" type="text" inputMode="url" placeholder="Lien Instagram, Google Drive, site web…" />
            <p className="field-note">
              Un lien suffit pour l&apos;instant. Vous pouvez aussi{" "}
              <a href="/inscription">créer directement votre compte prestataire</a> et publier vos photos.
            </p>
          </div>
          <SubmitButton>Rejoindre la liste</SubmitButton>
        </fieldset>
        <FormMessage state={proState} />
      </form>
    </div>
  );
}
