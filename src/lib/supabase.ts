"use client";

import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function ensureAnonymousAuth(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user;
  const { data: { user: anonUser }, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return anonUser ?? null;
}
