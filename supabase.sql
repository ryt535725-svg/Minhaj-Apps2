-- MINHAJ Apps: Supabase database setup
create table if not exists public.apps (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 icon text default '📦',
 image_url text,
 download_url text,
 rating integer default 5 check (rating between 1 and 5),
 downloads text default '0',
 description text default '',
 created_at timestamptz not null default now()
);

create table if not exists public.prompts (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 emoji text default '🤖',
 image_url text,
 created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.apps enable row level security;
alter table public.prompts enable row level security;
alter table public.admin_users enable row level security;

create policy "public can read apps" on public.apps for select using (true);
create policy "admins can insert apps" on public.apps for insert to authenticated with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins can update apps" on public.apps for update to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid())) with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins can delete apps" on public.apps for delete to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid()));

create policy "public can read prompts" on public.prompts for select using (true);
create policy "admins can insert prompts" on public.prompts for insert to authenticated with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins can update prompts" on public.prompts for update to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid())) with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins can delete prompts" on public.prompts for delete to authenticated using (exists(select 1 from public.admin_users where user_id=auth.uid()));

-- প্রথম admin user তৈরি করার পরে নিচের line-এ তার Auth User ID বসিয়ে চালান:
-- insert into public.admin_users (user_id) values ('YOUR-USER-UUID');
