-- =====================================================================
-- Janjua Curtain House — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Safe to re-run: every statement is idempotent.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Helper: is the current request an authenticated admin?
-- Admins are simply any confirmed user in auth.users. Create them from
-- the Supabase dashboard (Authentication → Users → Add user) — public
-- sign-up should stay disabled for this project.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.role() = 'authenticated' and auth.uid() is not null;
$$;

-- ---------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- 1. inquiries
-- =====================================================================
do $$ begin
  create type public.inquiry_status as enum ('new', 'contacted', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.inquiries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(trim(name)) between 2 and 80),
  phone          text not null check (char_length(trim(phone)) between 7 and 25),
  email          text,
  service        text not null,
  preferred_date date,
  message        text,
  status         public.inquiry_status not null default 'new',
  created_at     timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx     on public.inquiries (status);

-- =====================================================================
-- 2. gallery
-- =====================================================================
create table if not exists public.gallery (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  category     text not null default 'Curtains',
  image_url    text not null,
  storage_path text,
  is_featured  boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists gallery_category_idx on public.gallery (category);
create index if not exists gallery_featured_idx on public.gallery (is_featured);

-- =====================================================================
-- 3. services
-- =====================================================================
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  category    text not null default 'Curtains',
  icon        text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists services_active_idx on public.services (is_active);

-- =====================================================================
-- 4. promotions
-- =====================================================================
create table if not exists public.promotions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  discount    integer not null default 0 check (discount between 0 and 100),
  cta_label   text not null default 'Claim Your Offer',
  is_active   boolean not null default false,
  start_date  date,
  end_date    date,
  created_at  timestamptz not null default now()
);

create index if not exists promotions_active_idx on public.promotions (is_active, created_at desc);

-- =====================================================================
-- 5. site_settings  (single row, id = 1)
-- =====================================================================
create table if not exists public.site_settings (
  id            integer primary key default 1 check (id = 1),
  business_name text not null default 'Janjua Curtain House',
  tagline       text not null default 'Style | Comfort | Elegance',
  phone         text not null default '+971547400549',
  whatsapp      text not null default '+971547400549',
  location      text not null default 'UAE',
  email         text,
  instagram     text,
  facebook      text,
  updated_at    timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.inquiries     enable row level security;
alter table public.gallery       enable row level security;
alter table public.services      enable row level security;
alter table public.promotions    enable row level security;
alter table public.site_settings enable row level security;

-- inquiries: anyone may submit, only admins may read/modify.
drop policy if exists "public can submit inquiries" on public.inquiries;
create policy "public can submit inquiries"
  on public.inquiries for insert to anon, authenticated with check (true);

drop policy if exists "admins read inquiries" on public.inquiries;
create policy "admins read inquiries"
  on public.inquiries for select to authenticated using (public.is_admin());

drop policy if exists "admins update inquiries" on public.inquiries;
create policy "admins update inquiries"
  on public.inquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete inquiries" on public.inquiries;
create policy "admins delete inquiries"
  on public.inquiries for delete to authenticated using (public.is_admin());

-- gallery: world-readable, admin-writable.
drop policy if exists "gallery is public" on public.gallery;
create policy "gallery is public"
  on public.gallery for select to anon, authenticated using (true);

drop policy if exists "admins write gallery" on public.gallery;
create policy "admins write gallery"
  on public.gallery for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- services: only active rows are public; admins see and write everything.
drop policy if exists "active services are public" on public.services;
create policy "active services are public"
  on public.services for select to anon using (is_active);

drop policy if exists "admins read services" on public.services;
create policy "admins read services"
  on public.services for select to authenticated using (true);

drop policy if exists "admins write services" on public.services;
create policy "admins write services"
  on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- promotions: only active rows are public.
drop policy if exists "active promotions are public" on public.promotions;
create policy "active promotions are public"
  on public.promotions for select to anon using (is_active);

drop policy if exists "admins read promotions" on public.promotions;
create policy "admins read promotions"
  on public.promotions for select to authenticated using (true);

drop policy if exists "admins write promotions" on public.promotions;
create policy "admins write promotions"
  on public.promotions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings: world-readable, admin-writable.
drop policy if exists "settings are public" on public.site_settings;
create policy "settings are public"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "admins write settings" on public.site_settings;
create policy "admins write settings"
  on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Storage bucket: gallery
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "gallery objects are public" on storage.objects;
create policy "gallery objects are public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'gallery');

drop policy if exists "admins upload gallery objects" on storage.objects;
create policy "admins upload gallery objects"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admins update gallery objects" on storage.objects;
create policy "admins update gallery objects"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admins delete gallery objects" on storage.objects;
create policy "admins delete gallery objects"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.is_admin());
