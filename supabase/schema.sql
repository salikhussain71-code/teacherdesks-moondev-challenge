-- ChaseLog schema. Paste into Supabase > SQL Editor > Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free','pro')),
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_name text not null check (char_length(client_name) between 1 and 120),
  amount numeric(12,2) not null check (amount > 0),
  due_date date not null,
  status text not null default 'pending' check (status in ('pending','paid')),
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists invoices_user_due_idx on public.invoices (user_id, due_date);

alter table public.profiles enable row level security;
alter table public.invoices enable row level security;

-- Users may READ their profile but never write it: they cannot self-upgrade.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "invoices_select_own" on public.invoices;
drop policy if exists "invoices_insert_own" on public.invoices;
drop policy if exists "invoices_update_own" on public.invoices;
drop policy if exists "invoices_delete_own" on public.invoices;
create policy "invoices_select_own" on public.invoices for select using (auth.uid() = user_id);
create policy "invoices_insert_own" on public.invoices for insert with check (auth.uid() = user_id);
create policy "invoices_update_own" on public.invoices for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "invoices_delete_own" on public.invoices for delete using (auth.uid() = user_id);

-- Create a profile row for every new auth user.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
insert into public.profiles (id) select id from auth.users on conflict do nothing;

-- PAID GATE #1 (database-enforced): free plan is capped at 5 invoices.
create or replace function public.enforce_free_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
declare t text; c int;
begin
  select tier into t from public.profiles where id = new.user_id;
  if coalesce(t, 'free') = 'free' then
    select count(*) into c from public.invoices where user_id = new.user_id;
    if c >= 5 then
      raise exception 'FREE_LIMIT: The free plan is limited to 5 invoices. Upgrade to Pro for unlimited.';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists invoices_free_limit on public.invoices;
create trigger invoices_free_limit before insert on public.invoices
  for each row execute function public.enforce_free_limit();

-- Simulated payment: the ONLY way a tier changes, and only for the caller's own row.
create or replace function public.set_my_tier(new_tier text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if new_tier not in ('free','pro') then raise exception 'Invalid tier'; end if;
  update public.profiles set tier = new_tier where id = auth.uid();
end $$;
revoke all on function public.set_my_tier(text) from public, anon;
grant execute on function public.set_my_tier(text) to authenticated;
