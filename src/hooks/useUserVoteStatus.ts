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
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkVote = async (uid: string) => {
      try {
        const { data } = await supabase
          .from("votes")
          .select("user_id, selected, created_at, guest_name")
          .eq("user_id", uid)
          .maybeSingle();
        if (cancelled) return;
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
      } catch {
        if (!cancelled) setVoted(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setUserId(null);
          setVoted(false);
          setVoteRecord(null);
          return;
        }
        setUserId(session.user.id);
        await checkVote(session.user.id);
      }
    );

    let retryCount = 0;
    const maxRetries = 12; // ~7s total so session restore has time after auth-ready gate
    // setTimeout returns number in browser, NodeJS.Timeout in Node (build)
    const retryRef: { current: number | ReturnType<typeof setTimeout> | null } = { current: null };

    const trySession = () => {
      if (cancelled) return;
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          if (cancelled) return;
          if (session?.user) {
            setUserId(session.user.id);
            checkVote(session.user.id);
            return;
          }
          if (retryCount < maxRetries) {
            retryCount += 1;
            retryRef.current = window.setTimeout(trySession, 600);
          }
        })
        .catch(() => {
          if (retryCount < maxRetries) {
            retryCount += 1;
            retryRef.current = window.setTimeout(trySession, 600);
          }
        });
    };

    trySession();

    return () => {
      cancelled = true;
      if (retryRef.current != null) clearTimeout(retryRef.current);
      subscription.unsubscribe();
    };
  }, []);

  return { voted, voteRecord, loading, userId };
}
