create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  business_name text not null,
  email text not null,
  status text not null default 'new' check (status in ('new', 'qualified', 'meeting', 'proposal', 'won', 'lost')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Authenticated users can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated users can insert leads"
  on public.leads for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete leads"
  on public.leads for delete
  to authenticated
  using (true);

alter publication supabase_realtime add table public.leads;
