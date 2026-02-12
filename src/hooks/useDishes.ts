"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Dish } from "@/types";

export function useDishes(): { dishes: Dish[]; loading: boolean; error: string | null } {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setError(null);
      const { data, error: err } = await supabase
        .from("dishes")
        .select("id, name, votes")
        .order("votes", { ascending: false });
      if (err) {
        setError(err.message);
        if (typeof window !== "undefined") console.error("Dishes fetch error:", err);
      }
      if (!err && data) {
        setDishes((data || []) as Dish[]);
      }
      setLoading(false);
    };

    fetch();

    const channel = supabase
      .channel("dishes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dishes" },
        () => fetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { dishes, loading, error };
}
