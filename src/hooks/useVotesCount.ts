"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TOTAL_GUESTS } from "@/lib/constants";

export function useVotesCount(): { votedCount: number; total: number } {
  const [votedCount, setVotedCount] = useState(0);

  const fetchCount = async () => {
    const { data } = await supabase.rpc("get_vote_count");
    if (typeof data === "number") setVotedCount(data);
  };

  useEffect(() => {
    fetchCount();

    const channel = supabase
      .channel("votes-count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        fetchCount
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { votedCount, total: TOTAL_GUESTS };
}
