import "server-only";
import type { RequestStatus } from "./constants";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export type Provider = {
  id: string;
  owner_id: string | null;
  slug: string;
  name: string;
  trade: string;
  department: string;
  city: string | null;
  description: string | null;
  specialties: string[];
  events: string[];
  delivery: boolean;
  price_from: number | null;
  website_url: string | null;
  instagram_url: string | null;
  photos: string[];
  featured: boolean;
  published: boolean;
};

export type ReceivedRequest = {
  status: RequestStatus;
  created_at: string;
  request: {
    id: string;
    event_type: string;
    event_date: string | null;
    department: string;
    city: string | null;
    guests: number | null;
    budget: number | null;
    trades: string[];
    message: string | null;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    target_provider_id: string | null;
  };
};

const PROVIDER_COLUMNS =
  "id, owner_id, slug, name, trade, department, city, description, specialties, events, delivery, price_from, website_url, instagram_url, photos, featured, published";

export type ProviderFilters = {
  trade?: string;
  department?: string;
  event?: string;
};

export async function listProviders(
  filters: ProviderFilters = {},
): Promise<Provider[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  let query = supabase
    .from("providers")
    .select(PROVIDER_COLUMNS)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true });

  if (filters.trade) query = query.eq("trade", filters.trade);
  if (filters.department) query = query.eq("department", filters.department);
  if (filters.event) query = query.contains("events", [filters.event]);

  const { data, error } = await query;
  if (error) throw error;
  return data as Provider[];
}

export async function listFeaturedProviders(limit = 4): Promise<Provider[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select(PROVIDER_COLUMNS)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data as Provider[];
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select(PROVIDER_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Provider | null;
}

export async function getOwnProvider(userId: string): Promise<Provider | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select(PROVIDER_COLUMNS)
    .eq("owner_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Provider | null;
}

export async function listReceivedRequests(
  providerId: string,
): Promise<ReceivedRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_request_recipients")
    .select(
      "status, created_at, request:quote_requests (id, event_type, event_date, department, city, guests, budget, trades, message, first_name, last_name, email, phone, target_provider_id)",
    )
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as unknown as ReceivedRequest[];
}
