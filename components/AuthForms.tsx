"use client";

import { useActionState } from "react";
import { signIn, signUp } from "@/app/auth/actions";
import { initialFormState } from "@/lib/forms";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";

export function SignInForm({ next }: { next?: string }) {
  const [state, action] = useActionState(signIn, initialFormState);
  return (
    <form action={action}>
      <input type="hidden" name="next" value={next ?? "/espace-pro"} />
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="login-password">Mot de passe</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

export function SignUpForm() {
  const [state, action] = useActionState(signUp, initialFormState);
  if (state.status === "success") {
    return <p className="thanks">{state.message}</p>;
  }
  return (
    <form action={action}>
      <div className="field">
        <label htmlFor="signup-email">Email professionnel</label>
        <input id="signup-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="signup-password">Mot de passe</label>
        <input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <p className="field-note">8 caractères minimum.</p>
      </div>
      <SubmitButton pendingLabel="Création…">Créer mon compte</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
