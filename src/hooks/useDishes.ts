"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Dish } from "@/types";

export function useDishes(): { dishes: Dish[]; loading: boolean } {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("dishes")
        .select("id, name, votes")
        .order("votes", { ascending: false });
      if (!error && data) {
        setDishes(data as Dish[]);
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

  return { dishes, loading };
}
