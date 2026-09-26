-- Fetify — schéma initial
-- Tables : inscriptions à la liste d'attente, fiches prestataires,
-- demandes de devis et leur distribution aux prestataires.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Liste d'attente (formulaires de la page d'accueil)
-- ---------------------------------------------------------------------------
create table public.waitlist_signups (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null check (kind in ('client', 'prestataire')),
  first_name   text,
  last_name    text,
  business_name text,
  email        text not null,
  phone        text,
  postal_code  text,
  event_type   text,
  venue        text,
  guests       integer check (guests is null or guests > 0),
  trade        text,
  department   text,
  events       text[] not null default '{}',
  delivery     boolean,
  portfolio_url text,
  created_at   timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

-- Tout le monde peut s'inscrire ; personne ne peut relire la liste via l'API
-- publique (consultation depuis le tableau de bord Supabase).
create policy "waitlist: insertion publique"
  on public.waitlist_signups for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Prestataires
-- ---------------------------------------------------------------------------
create table public.providers (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid unique references auth.users (id) on delete cascade,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name          text not null check (char_length(name) between 2 and 80),
  trade         text not null,
  department    text not null,
  city          text,
  description   text check (description is null or char_length(description) <= 2000),
  specialties   text[] not null default '{}',
  events        text[] not null default '{}',
  delivery      boolean not null default false,
  price_from    integer check (price_from is null or price_from >= 0),
  website_url   text,
  instagram_url text,
  photos        text[] not null default '{}',
  featured      boolean not null default false,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index providers_search_idx on public.providers (published, trade, department);

alter table public.providers enable row level security;

create policy "providers: fiches publiées visibles par tous"
  on public.providers for select
  to anon, authenticated
  using (published or owner_id = auth.uid());

create policy "providers: création de sa propre fiche"
  on public.providers for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "providers: modification de sa propre fiche"
  on public.providers for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Les colonnes « featured » et « published » sont réservées à la modération :
-- un prestataire ne peut pas se mettre en avant ni se publier lui-même.
create function public.providers_guard_moderation()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'authenticated' then
    if tg_op = 'INSERT' then
      new.featured := false;
      new.published := false;
    else
      new.featured := old.featured;
      new.published := old.published;
      new.owner_id := old.owner_id;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger providers_guard_moderation
  before insert or update on public.providers
  for each row execute function public.providers_guard_moderation();

-- ---------------------------------------------------------------------------
-- Demandes de devis
-- ---------------------------------------------------------------------------
create table public.quote_requests (
  id                 uuid primary key default gen_random_uuid(),
  event_type         text not null,
  event_date         date,
  department         text not null,
  city               text,
  guests             integer check (guests is null or guests > 0),
  budget             integer check (budget is null or budget >= 0),
  trades             text[] not null default '{}',
  message            text check (message is null or char_length(message) <= 3000),
  first_name         text not null,
  last_name          text not null,
  email              text not null,
  phone              text,
  target_provider_id uuid references public.providers (id) on delete set null,
  created_at         timestamptz not null default now()
);

create table public.quote_request_recipients (
  request_id  uuid not null references public.quote_requests (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  status      text not null default 'nouvelle'
              check (status in ('nouvelle', 'vue', 'repondue', 'declinee')),
  created_at  timestamptz not null default now(),
  primary key (request_id, provider_id)
);

create index quote_request_recipients_provider_idx
  on public.quote_request_recipients (provider_id, created_at desc);

alter table public.quote_requests enable row level security;
alter table public.quote_request_recipients enable row level security;

-- Un prestataire lit les demandes qui lui ont été adressées.
create policy "quote_requests: lecture par les destinataires"
  on public.quote_requests for select
  to authenticated
  using (
    exists (
      select 1
      from public.quote_request_recipients r
      join public.providers p on p.id = r.provider_id
      where r.request_id = quote_requests.id
        and p.owner_id = auth.uid()
    )
  );

create policy "recipients: lecture par le prestataire"
  on public.quote_request_recipients for select
  to authenticated
  using (
    exists (
      select 1 from public.providers p
      where p.id = provider_id and p.owner_id = auth.uid()
    )
  );

create policy "recipients: mise à jour du statut par le prestataire"
  on public.quote_request_recipients for update
  to authenticated
  using (
    exists (
      select 1 from public.providers p
      where p.id = provider_id and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.providers p
      where p.id = provider_id and p.owner_id = auth.uid()
    )
  );

-- Seul le statut est modifiable par un prestataire.
revoke update on public.quote_request_recipients from anon, authenticated;
grant update (status) on public.quote_request_recipients to authenticated;

-- Dépôt d'une demande + distribution aux prestataires correspondants.
-- Exécutée avec les droits du propriétaire : les visiteurs ne peuvent ni lire
-- les demandes ni choisir eux-mêmes les destinataires.
-- Retourne le nombre de prestataires qui ont reçu la demande.
create function public.submit_quote_request(
  p_event_type  text,
  p_event_date  date,
  p_department  text,
  p_city        text,
  p_guests      integer,
  p_budget      integer,
  p_trades      text[],
  p_message     text,
  p_first_name  text,
  p_last_name   text,
  p_email       text,
  p_phone       text,
  p_target_provider_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request_id uuid;
  v_count integer;
begin
  insert into quote_requests (
    event_type, event_date, department, city, guests, budget, trades,
    message, first_name, last_name, email, phone, target_provider_id
  ) values (
    p_event_type, p_event_date, p_department, nullif(p_city, ''), p_guests,
    p_budget, coalesce(p_trades, '{}'), nullif(p_message, ''), p_first_name,
    p_last_name, p_email, nullif(p_phone, ''), p_target_provider_id
  )
  returning id into v_request_id;

  if p_target_provider_id is not null then
    insert into quote_request_recipients (request_id, provider_id)
    select v_request_id, p.id
    from providers p
    where p.id = p_target_provider_id and p.published;
  else
    insert into quote_request_recipients (request_id, provider_id)
    select v_request_id, p.id
    from providers p
    where p.published
      and p.owner_id is not null
      and p.department = p_department
      and (cardinality(p.events) = 0 or p_event_type = any (p.events))
      and (coalesce(cardinality(p_trades), 0) = 0 or p.trade = any (p_trades));
  end if;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.submit_quote_request from public;
grant execute on function public.submit_quote_request to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Photos des prestataires (Supabase Storage)
-- Chaque prestataire écrit dans le dossier portant son identifiant utilisateur.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('provider-photos', 'provider-photos', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "photos: envoi dans son dossier"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'provider-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos: suppression dans son dossier"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'provider-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
