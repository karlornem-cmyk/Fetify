import type { FormState } from "@/lib/forms";

export function FormMessage({ state }: { state: FormState }) {
  const tone =
    state.status === "error" ? " is-error" : state.status === "success" ? " is-success" : "";
  return (
    <p className={`form-status${tone}`} role="status" aria-live="polite">
      {state.message}
    </p>
  );
}
