export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Faux tant que les variables d'environnement Supabase ne sont pas renseignées. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const PHOTOS_BUCKET = "provider-photos";

export function photoUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${PHOTOS_BUCKET}/${path}`;
}
