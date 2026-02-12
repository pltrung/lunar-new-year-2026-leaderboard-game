"use client";

import { supabase } from "@/lib/supabase";

export async function submitVote(
  selectedDishIds: [string, string],
  guestName: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const name = guestName?.trim() || "";
  if (!name) throw new Error("Please enter your name");

  const { error } = await supabase.from("votes").insert({
    user_id: user.id,
    selected: selectedDishIds,
    guest_name: name || null,
  });

  if (error) {
    if (error.code === "23505") throw new Error("Already voted");
    throw new Error(error.message);
  }
}
