"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { VoteRecord } from "@/types";

export function useUserVoteStatus(): {
  voted: boolean;
  voteRecord: VoteRecord | null;
  loading: boolean;
  userId: string | null;
} {
  const [voted, setVoted] = useState(false);
  const [voteRecord, setVoteRecord] = useState<VoteRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkVote = async (uid: string) => {
      const { data } = await supabase
        .from("votes")
        .select("user_id, selected, created_at, guest_name")
        .eq("user_id", uid)
        .maybeSingle();
      if (data) {
        setVoteRecord({
          userId: data.user_id,
          selected: data.selected as [string, string],
          createdAt: data.created_at,
          guestName: data.guest_name ?? undefined,
        });
        setVoted(true);
      } else {
        setVoteRecord(null);
        setVoted(false);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setUserId(null);
          setVoted(false);
          setVoteRecord(null);
          setLoading(false);
          return;
        }
        setUserId(session.user.id);
        await checkVote(session.user.id);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        checkVote(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { voted, voteRecord, loading, userId };
}
