-- Add guest name to votes (who voted)
alter table public.votes
  add column if not exists guest_name text;
