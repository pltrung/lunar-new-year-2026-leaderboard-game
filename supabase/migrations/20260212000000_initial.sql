-- Dishes: id, name, votes (updated by trigger when votes are inserted)
create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  votes int not null default 0
);

-- Votes: one per user, exactly 2 dish ids
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  selected uuid[] not null check (array_length(selected, 1) = 2),
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- Trigger: when a vote is inserted, increment the two dishes' vote counts
create or replace function public.increment_dish_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.dishes set votes = votes + 1 where id = new.selected[1];
  update public.dishes set votes = votes + 1 where id = new.selected[2];
  return new;
end;
$$;

drop trigger if exists on_vote_insert on public.votes;
create trigger on_vote_insert
  after insert on public.votes
  for each row execute function public.increment_dish_votes();

-- RLS: dishes — anyone can read (including anon for leaderboard)
alter table public.dishes enable row level security;

drop policy if exists "Anyone can read dishes" on public.dishes;
create policy "Anyone can read dishes"
  on public.dishes for select
  using (true);

-- No insert/update/delete policies = only trigger (SECURITY DEFINER) can update

-- RLS: votes — users can read their own vote and insert one (user_id = auth.uid())
alter table public.votes enable row level security;

drop policy if exists "Users can read own vote" on public.votes;
create policy "Users can read own vote"
  on public.votes for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own vote" on public.votes;
create policy "Users can insert own vote"
  on public.votes for insert
  with check (auth.uid() = user_id and array_length(selected, 1) = 2);

-- No update/delete policies = votes are immutable

-- Enable Realtime for leaderboard and vote count (ignore if already in publication)
do $$ begin alter publication supabase_realtime add table public.dishes; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.votes; exception when others then null; end $$;

grant usage on schema public to anon, authenticated;
grant select on public.dishes to anon, authenticated;

-- RPC for participation count (callable by anon)
create or replace function public.get_vote_count()
returns int
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int from public.votes;
$$;

grant execute on function public.get_vote_count() to anon, authenticated;
