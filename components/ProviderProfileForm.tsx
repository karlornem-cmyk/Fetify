"use client";

import { useActionState } from "react";
import { saveProvider } from "@/app/espace-pro/actions";
import { EVENTS } from "@/lib/constants";
import type { Provider } from "@/lib/data";
import { initialFormState } from "@/lib/forms";
import { FormMessage } from "./FormMessage";
import { DepartmentOptions, TradeOptions } from "./Options";
import { SubmitButton } from "./SubmitButton";

export function ProviderProfileForm({ provider }: { provider: Provider | null }) {
  const [state, action] = useActionState(saveProvider, initialFormState);

  return (
    <form action={action}>
      <div className="field">
        <label htmlFor="p-name">Nom commercial</label>
        <input id="p-name" name="name" type="text" required minLength={2} maxLength={80} defaultValue={provider?.name} />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="p-trade">Métier</label>
          <select id="p-trade" name="trade" required defaultValue={provider?.trade ?? ""}>
            <option value="" disabled>
              Sélectionner…
            </option>
            <TradeOptions />
          </select>
        </div>
        <div className="field">
          <label htmlFor="p-department">Département</label>
          <select id="p-department" name="department" required defaultValue={provider?.department ?? ""}>
            <option value="" disabled>
              Sélectionner…
            </option>
            <DepartmentOptions />
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="p-city">Ville</label>
          <input id="p-city" name="city" type="text" maxLength={80} defaultValue={provider?.city ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="p-price">Tarif à partir de (€)</label>
          <input id="p-price" name="priceFrom" type="number" min={1} step={1} defaultValue={provider?.price_from ?? ""} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="p-specialties">Spécialités</label>
        <input
          id="p-specialties"
          name="specialties"
          type="text"
          placeholder="Cake design, cuisine antillaise… (séparées par des virgules)"
          defaultValue={provider?.specialties.join(", ")}
        />
      </div>
      <div className="field">
        <label htmlFor="p-description">Présentation</label>
        <textarea id="p-description" name="description" maxLength={2000} defaultValue={provider?.description ?? ""} />
      </div>
      <fieldset className="field field-events">
        <legend>Événements couverts</legend>
        <div className="checks">
          {EVENTS.map((e) => (
            <label className="check" key={e}>
              <input type="checkbox" name="events" value={e} defaultChecked={provider?.events.includes(e) ?? true} /> {e}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field field-events">
        <legend>Livraison / déplacement</legend>
        <div className="checks">
          <label className="check">
            <input type="radio" name="delivery" value="oui" defaultChecked={provider?.delivery === true} /> Oui
          </label>
          <label className="check">
            <input type="radio" name="delivery" value="non" defaultChecked={provider?.delivery !== true} /> Non
          </label>
        </div>
      </fieldset>
      <div className="field-row">
        <div className="field">
          <label htmlFor="p-website">Site web</label>
          <input id="p-website" name="website" type="text" inputMode="url" placeholder="www.exemple.fr" defaultValue={provider?.website_url ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="p-instagram">Instagram</label>
          <input id="p-instagram" name="instagram" type="text" inputMode="url" placeholder="instagram.com/…" defaultValue={provider?.instagram_url ?? ""} />
        </div>
      </div>
      <SubmitButton pendingLabel="Enregistrement…">{provider ? "Enregistrer" : "Créer ma fiche"}</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
