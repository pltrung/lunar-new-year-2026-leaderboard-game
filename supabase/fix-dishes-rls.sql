-- ============================================================
-- FIX: App can't read dishes (RLS or grants missing)
-- Run this entire script in Supabase SQL Editor.
-- ============================================================

-- DIAGNOSTIC (optional): See current RLS policies on dishes. Run first if you want to check.
-- SELECT policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'dishes';

-- 1. Ensure anon can read schema and table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.dishes TO anon, authenticated;

-- 2. Enable RLS on dishes (if not already)
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing select policy if it has a different name, then create the one we need
DROP POLICY IF EXISTS "Anyone can read dishes" ON public.dishes;
DROP POLICY IF EXISTS "Allow public read access on dishes" ON public.dishes;

CREATE POLICY "Anyone can read dishes"
  ON public.dishes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Verify: run as anon (this simulates what your app does)
-- In SQL Editor you run as postgres, so to test anon you'd use a different method.
-- After running the above, reload your app; dishes should load.
