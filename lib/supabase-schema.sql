create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('owner', 'admin', 'manager', 'agent', 'client');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.lead_status as enum ('new', 'qualified', 'meeting', 'proposal', 'won', 'lost');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.activity_type as enum ('lead_created', 'lead_updated', 'lead_deleted', 'note_created', 'status_changed', 'login');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.notification_type as enum ('success', 'info', 'warning', 'error');
exception when duplicate_object then null; end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade default auth.uid(),
  name text not null check (char_length(trim(name)) >= 2),
  phone text not null check (char_length(trim(phone)) >= 7),
  business_name text not null check (char_length(trim(business_name)) >= 2),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade default auth.uid(),
  body text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id) on delete set null default auth.uid(),
  lead_id uuid references public.leads(id) on delete set null,
  type public.activity_type not null,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade default auth.uid(),
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade default auth.uid(),
  type public.notification_type not null default 'info',
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_leads_owner_status on public.leads(owner_id, status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_search on public.leads using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(business_name,'') || ' ' || coalesce(email,'') || ' ' || coalesce(phone,'')));
create index if not exists idx_lead_notes_lead_created on public.lead_notes(lead_id, created_at desc);
create index if not exists idx_activities_actor_created on public.activities(actor_id, created_at desc);
create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at before update on public.users for each row execute function public.set_updated_at();
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
drop trigger if exists set_lead_notes_updated_at on public.lead_notes;
create trigger set_lead_notes_updated_at before update on public.lead_notes for each row execute function public.set_updated_at();
drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at before update on public.settings for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, coalesce(new.email, ''), 'admin')
  on conflict (id) do update set email = excluded.email;

  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1)))
  on conflict (id) do nothing;

  insert into public.settings (user_id, key, value)
  values (new.id, 'dashboard', '{"pageSize":10}'::jsonb)
  on conflict (user_id, key) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.activities enable row level security;
alter table public.settings enable row level security;
alter table public.notifications enable row level security;

create policy "Users can read own user row" on public.users for select to authenticated using (id = auth.uid());
create policy "Users can update own user row" on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Users can manage own leads" on public.leads for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Users can manage notes on own leads" on public.lead_notes for all to authenticated using (exists (select 1 from public.leads where leads.id = lead_notes.lead_id and leads.owner_id = auth.uid())) with check (author_id = auth.uid() and exists (select 1 from public.leads where leads.id = lead_notes.lead_id and leads.owner_id = auth.uid()));
create policy "Users can read own activities" on public.activities for select to authenticated using (actor_id = auth.uid());
create policy "Users can create own activities" on public.activities for insert to authenticated with check (actor_id = auth.uid());
create policy "Users can manage own settings" on public.settings for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can manage own notifications" on public.notifications for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

do $$ begin alter publication supabase_realtime add table public.leads; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.lead_notes; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.activities; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end $$;
