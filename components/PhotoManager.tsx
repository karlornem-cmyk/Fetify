"use client";

import { useActionState } from "react";
import { deletePhoto, uploadPhoto } from "@/app/espace-pro/actions";
import { initialFormState } from "@/lib/forms";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

export function PhotoManager({ photos, urls }: { photos: string[]; urls: string[] }) {
  const [state, action] = useActionState(uploadPhoto, initialFormState);

  return (
    <>
      {photos.length > 0 ? (
        <div className="thumbs">
          {photos.map((path, i) => (
            <form key={path} className="thumb" action={deletePhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urls[i]} alt="" />
              <input type="hidden" name="path" value={path} />
              <button type="submit" aria-label="Supprimer cette photo" title="Supprimer">
                ×
              </button>
            </form>
          ))}
        </div>
      ) : (
        <p className="field-note" style={{ marginBottom: 16 }}>
          Aucune photo pour l&apos;instant. Des visuels soignés font toute la différence.
        </p>
      )}
      <form action={action}>
        <div className="field">
          <label htmlFor="photo">Ajouter une photo (JPEG, PNG ou WebP, 5 Mo max)</label>
          <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
        </div>
        <SubmitButton className="btn btn-ghost" pendingLabel="Envoi…">
          Envoyer la photo
        </SubmitButton>
        <FormMessage state={state} />
      </form>
    </>
  );
}
