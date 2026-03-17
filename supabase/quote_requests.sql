create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  status text not null default 'nueva',
  source_page text,
  client_name text not null,
  client_phone text not null,
  client_email text,
  preferred_contact text,
  request_date date,
  vehicle_year text,
  make_model text not null,
  vin text,
  odometer text,
  service_type text,
  availability text,
  budget_range text,
  issue_details text not null,
  goals text,
  request_items text,
  selected_services text[] not null default '{}',
  follow_up_date date,
  internal_notes text
);

alter table public.quote_requests
  add column if not exists follow_up_date date,
  add column if not exists internal_notes text;

alter table public.quote_requests enable row level security;

drop policy if exists "Public can insert quote requests" on public.quote_requests;
create policy "Public can insert quote requests"
on public.quote_requests
for insert
to anon, authenticated
with check (true);

drop policy if exists "Only authenticated users can read quote requests" on public.quote_requests;
create policy "Only authenticated users can read quote requests"
on public.quote_requests
for select
to authenticated
using (true);

drop policy if exists "Only authenticated users can update quote requests" on public.quote_requests;
create policy "Only authenticated users can update quote requests"
on public.quote_requests
for update
to authenticated
using (true)
with check (true);
