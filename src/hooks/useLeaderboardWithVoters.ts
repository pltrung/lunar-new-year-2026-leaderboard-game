"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LeaderboardRow {
  id: string;
  name: string;
  votes: number;
  voters: string[];
}

export function useLeaderboardWithVoters(): {
  items: LeaderboardRow[];
  loading: boolean;
} {
  const [items, setItems] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase.rpc("get_leaderboard_with_voters");
    if (!error && data && Array.isArray(data)) {
      setItems(
        (data as { id: string; name: string; votes: number; voters: string[] }[]).map(
          (row) => ({
            id: row.id,
            name: row.name,
            votes: row.votes,
            voters: Array.isArray(row.voters) ? row.voters.filter(Boolean) : [],
          })
        )
      );
    } else {
      const { data: dishesData } = await supabase.from("dishes").select("id, name, votes").order("votes", { ascending: false }).limit(5);
      if (dishesData) {
        setItems(dishesData.map((d) => ({ id: d.id, name: d.name, votes: d.votes, voters: [] })));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("leaderboard-voters")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dishes" },
        fetchLeaderboard
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { items, loading };
}
