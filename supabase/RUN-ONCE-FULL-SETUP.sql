-- Run once in Supabase SQL Editor (as postgres role).
-- Sets up: dishes + votes tables, RLS, trigger, guest_name, get_vote_count, get_leaderboard_with_voters.
-- After this, run seed-dishes.sql to insert the 12 dishes.

-- ========== 1. Initial schema (tables, trigger, RLS, grants) ==========
-- (Contents of migrations/20260212000000_initial.sql)

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  votes int not null default 0
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  selected uuid[] not null check (array_length(selected, 1) = 2),
  created_at timestamptz not null default now(),
  unique(user_id)
);

create or replace function public.increment_dish_votes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.dishes set votes = votes + 1 where id = new.selected[1];
  update public.dishes set votes = votes + 1 where id = new.selected[2];
  return new;
end;
$$;

drop trigger if exists on_vote_insert on public.votes;
create trigger on_vote_insert after insert on public.votes for each row execute function public.increment_dish_votes();

alter table public.dishes enable row level security;
drop policy if exists "Anyone can read dishes" on public.dishes;
create policy "Anyone can read dishes" on public.dishes for select using (true);

alter table public.votes enable row level security;
drop policy if exists "Users can read own vote" on public.votes;
create policy "Users can read own vote" on public.votes for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own vote" on public.votes;
create policy "Users can insert own vote" on public.votes for insert with check (auth.uid() = user_id and array_length(selected, 1) = 2);

do $$ begin alter publication supabase_realtime add table public.dishes; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.votes; exception when others then null; end $$;

grant usage on schema public to anon, authenticated;
grant select on public.dishes to anon, authenticated;

create or replace function public.get_vote_count() returns int language sql security definer set search_path = public stable as $$
  select count(*)::int from public.votes;
$$;
grant execute on function public.get_vote_count() to anon, authenticated;

-- ========== 2. guest_name on votes ==========
alter table public.votes add column if not exists guest_name text;

-- ========== 3. Leaderboard RPC (top 5 + who voted) ==========
create or replace function public.get_leaderboard_with_voters()
returns table (id uuid, name text, votes int, voters text[])
language sql security definer set search_path = public stable as $$
  select d.id, d.name, d.votes,
    coalesce(
      (select array_agg(v.guest_name order by v.created_at) from public.votes v where d.id = any(v.selected) and v.guest_name is not null),
      array[]::text[]
    )
  from public.dishes d order by d.votes desc limit 5;
$$;
grant execute on function public.get_leaderboard_with_voters() to anon, authenticated;
