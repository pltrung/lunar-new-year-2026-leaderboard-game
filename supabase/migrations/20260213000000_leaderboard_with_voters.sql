-- Top 5 dishes with list of guest names who voted for each (for public leaderboard)
create or replace function public.get_leaderboard_with_voters()
returns table (
  id uuid,
  name text,
  votes int,
  voters text[]
)
language sql
security definer
set search_path = public
stable
as $$
  select
    d.id,
    d.name,
    d.votes,
    coalesce(
      (select array_agg(v.guest_name order by v.created_at)
       from public.votes v
       where d.id = any(v.selected) and v.guest_name is not null),
      array[]::text[]
    ) as voters
  from public.dishes d
  order by d.votes desc
  limit 5;
$$;

grant execute on function public.get_leaderboard_with_voters() to anon, authenticated;
