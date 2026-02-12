"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dish } from "@/types";

const MEDAL = {
  1: { emoji: "🏆", label: "1st", class: "text-amber-300" },
  2: { emoji: "🥈", label: "2nd", class: "text-slate-300" },
  3: { emoji: "🥉", label: "3rd", class: "text-amber-700" },
};

interface LeaderboardProps {
  dishes: Dish[];
  isLocked: boolean;
  loading?: boolean;
}

export function Leaderboard({ dishes, isLocked, loading }: LeaderboardProps) {
  const previousRanks = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    dishes.forEach((d, i) => previousRanks.current.set(d.id, i + 1));
  }, [dishes]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-lunar-red-deep/40 border border-lunar-gold/20 p-6 lantern-glow">
        <h2 className="font-serif text-xl text-lunar-gold mb-4">Leaderboard</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-lunar-red/20 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="rounded-2xl bg-lunar-red-deep/40 border border-lunar-gold/20 p-4 sm:p-6 lantern-glow"
    >
      <h2 className="font-serif text-xl sm:text-2xl text-lunar-gold mb-4 flex items-center gap-2">
        <span>Leaderboard</span>
        {!isLocked && (
          <span className="sparkle-dot text-lg inline-block">✨</span>
        )}
      </h2>
      <ul className="space-y-2">
        <AnimatePresence mode="popLayout">
          {dishes.map((dish, index) => {
            const rank = index + 1;
            const medal = rank <= 3 ? MEDAL[rank as 1 | 2 | 3] : null;
            const prevRank = previousRanks.current.get(dish.id);
            const justMoved = prevRank !== undefined && prevRank !== rank;

            return (
              <motion.li
                key={dish.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                }}
                exit={{ opacity: 0 }}
                className={`
                  flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl
                  bg-lunar-red/20 border border-lunar-gold/10
                  ${justMoved ? "rank-glow border-lunar-gold/40" : ""}
                  ${isLocked && rank <= 3 ? "ring-1 ring-lunar-gold/50" : ""}
                `}
              >
                <div className="flex-shrink-0 w-8 sm:w-10 text-center">
                  {medal ? (
                    <span
                      className={`text-lg sm:text-xl font-serif font-semibold ${medal.class}`}
                      title={medal.label}
                    >
                      {medal.emoji}
                    </span>
                  ) : (
                    <span className="text-lunar-gold-light/70 font-serif font-medium">
                      {rank}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-lunar-gold-light truncate block">
                    {dish.name}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <span className="font-serif font-semibold text-lunar-gold tabular-nums">
                    {dish.votes}
                  </span>
                  <span className="text-lunar-gold-light/70 text-sm ml-0.5">
                    votes
                  </span>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {dishes.length === 0 && (
        <p className="text-lunar-gold-light/60 text-sm py-4 text-center">
          No dishes yet. Add dishes in Firestore to get started.
        </p>
      )}
    </motion.div>
  );
}
