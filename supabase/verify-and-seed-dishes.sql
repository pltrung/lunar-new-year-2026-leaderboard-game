-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR (one block at a time if you want to debug)
-- ============================================================

-- STEP 1: Check if dishes table exists and what's in it (run this first, look at the result)
SELECT 'dishes table row count' as check_name, count(*)::text as result FROM public.dishes
UNION ALL
SELECT 'dishes table exists', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dishes') THEN 'yes' ELSE 'no' END;

-- STEP 2: If the table doesn't exist, run the initial migration first (supabase/migrations/20260212000000_initial.sql)
-- If "dishes table exists" = no, you must run the full initial migration before the seed below.

-- STEP 3: Clear and seed dishes (run this to get exactly 12 dishes)
DELETE FROM public.dishes;

INSERT INTO public.dishes (name, votes) VALUES
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

-- STEP 4: Verify (run this after the insert - you should see 12 rows)
SELECT id, name, votes FROM public.dishes ORDER BY name;
