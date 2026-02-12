"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Dish } from "@/types";

export function useDishes(): { dishes: Dish[]; loading: boolean; error: string | null } {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retried = false;
    let retryTimeout = 0;
    const fetch = async () => {
      if (cancelled) return;
      setError(null);
      const { data, error: err } = await supabase
        .from("dishes")
        .select("id, name, votes")
        .order("votes", { ascending: false });
      if (cancelled) return;
      if (err) {
        setError(err.message);
        if (typeof window !== "undefined") console.error("Dishes fetch error:", err);
        if (!retried) {
          retried = true;
          retryTimeout = window.setTimeout(fetch, 2000);
          return;
        }
      }
      if (!err && data) {
        const list = (data || []) as Dish[];
        setDishes(list);
        if (list.length === 0 && !retried) {
          retried = true;
          retryTimeout = window.setTimeout(fetch, 1500);
          return;
        }
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
      cancelled = true;
      clearTimeout(retryTimeout);
      supabase.removeChannel(channel);
    };
  }, []);

  return { dishes, loading, error };
}
