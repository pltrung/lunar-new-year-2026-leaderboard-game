-- Secret team reveal: vote_order and team (white/black) assigned at vote time, not shown until reveal phase.
-- Vote counting logic (trigger, RLS) unchanged.

alter table public.votes
  add column if not exists vote_order int,
  add column if not exists team text;

comment on column public.votes.vote_order is '1-based order in which this vote was cast; used for team assignment.';
comment on column public.votes.team is 'white if vote_order % 2 = 0, else black; revealed only after reveal phase.';

-- RPC: submit vote with server-computed vote_order and team (avoids race, keeps assignment secret).
create or replace function public.submit_vote(
  p_selected uuid[],
  p_guest_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_next_order int;
  v_team text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;
  if array_length(p_selected, 1) <> 2 then
    raise exception 'Must select exactly 2 dishes';
  end if;

  -- Compute next vote order and team in one step (no race).
  select count(*) + 1 into v_next_order from public.votes;
  v_team := case when v_next_order % 2 = 0 then 'white' else 'black' end;

  insert into public.votes (user_id, selected, guest_name, vote_order, team)
  values (v_user_id, p_selected, nullif(trim(p_guest_name), ''), v_next_order, v_team);
end;
$$;

grant execute on function public.submit_vote(uuid[], text) to anon, authenticated;
