-- Run this in Supabase SQL Editor when you're ready to reset for the real event.
-- This clears all votes and sets every dish's vote count back to 0.

-- 1. Remove all vote records (guests will be able to vote again as new anonymous users)
DELETE FROM public.votes;

-- 2. Reset vote count on every dish
UPDATE public.dishes SET votes = 0;
