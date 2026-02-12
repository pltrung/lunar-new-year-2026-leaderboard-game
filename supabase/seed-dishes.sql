-- Run this once in Supabase SQL Editor to add dummy dishes.
-- If you already have rows in dishes, this will add more (with different UUIDs).
-- To start fresh: delete all rows in Table Editor > dishes, then run this.

insert into public.dishes (name, votes) values
  ('Spring Rolls', 0),
  ('Dumplings', 0),
  ('Fish (Nián Nián Yǒu Yú)', 0),
  ('Nian Gao', 0),
  ('Longevity Noodles', 0),
  ('Buddha''s Delight', 0),
  ('Tangyuan', 0),
  ('Turnip Cake', 0),
  ('Eight Treasure Rice', 0),
  ('Hot Pot', 0),
  ('Rice Cakes', 0),
  ('Sweet Rice Balls', 0);
