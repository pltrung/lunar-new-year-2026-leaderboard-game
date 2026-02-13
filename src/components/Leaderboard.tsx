"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LeaderboardRow } from "@/hooks/useLeaderboardWithVoters";

const MEDAL = {
  1: { emoji: "🏆", label: "1st", class: "text-amber-300" },
  2: { emoji: "🥈", label: "2nd", class: "text-slate-300" },
  3: { emoji: "🥉", label: "3rd", class: "text-amber-700" },
};

/** Max names shown per dish to avoid overcrowding the tile; rest become "& N others" */
const MAX_VOTER_NAMES_SHOWN = 5;

function formatVoters(voters: string[]): string {
  if (voters.length <= MAX_VOTER_NAMES_SHOWN) {
    return voters.join(", ");
  }
  const shown = voters.slice(0, MAX_VOTER_NAMES_SHOWN).join(", ");
  const rest = voters.length - MAX_VOTER_NAMES_SHOWN;
  return `${shown} & ${rest} other${rest === 1 ? "" : "s"}`;
}

interface LeaderboardProps {
  items: LeaderboardRow[];
  isLocked: boolean;
  loading?: boolean;
  /** When true (e.g. countdown-zero sequence), pause layout/rank animations */
  pauseAnimations?: boolean;
}

export function Leaderboard({ items, isLocked, loading, pauseAnimations = false }: LeaderboardProps) {
  const previousRanks = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (pauseAnimations) return;
    items.forEach((d, i) => previousRanks.current.set(d.id, i + 1));
  }, [items, pauseAnimations]);

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
      layout={!pauseAnimations}
      className="rounded-2xl bg-lunar-red-deep/40 border border-lunar-gold/20 p-4 sm:p-6 lantern-glow"
    >
      <h2 className="font-serif text-xl sm:text-2xl text-lunar-gold mb-4 flex items-center gap-2">
        <span>Leaderboard</span>
        {!isLocked && (
          <span className="sparkle-dot text-lg inline-block">✨</span>
        )}
      </h2>
      <p className="text-sm text-lunar-gold-light/70 mb-3">Top 5 dishes</p>
      <ul className="space-y-2">
        <AnimatePresence mode="popLayout">
          {items.map((row, index) => {
            const rank = index + 1;
            const medal = rank <= 3 ? MEDAL[rank as 1 | 2 | 3] : null;
            const prevRank = previousRanks.current.get(row.id);
            const justMoved = prevRank !== undefined && prevRank !== rank;

            return (
              <motion.li
                key={row.id}
                layout={!pauseAnimations}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                }}
                exit={{ opacity: 0 }}
                className={`
                  flex flex-col gap-1.5 p-3 sm:p-4 rounded-xl
                  bg-lunar-red/20 border border-lunar-gold/10
                  ${justMoved ? "rank-glow border-lunar-gold/40" : ""}
                  ${isLocked && rank <= 3 ? "ring-1 ring-lunar-gold/50" : ""}
                `}
              >
                {/* Row 1: rank, dish name, votes */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
                      {row.name}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="font-serif font-semibold text-lunar-gold tabular-nums">
                      {row.votes}
                    </span>
                    <span className="text-lunar-gold-light/70 text-sm ml-0.5">
                      votes
                    </span>
                  </div>
                </div>
                {/* Row 2: Picked by (cap names to avoid overcrowding) */}
                {row.voters.length > 0 && (
                  <div className="text-xs text-lunar-gold-light/75 pl-11 sm:pl-12 flex flex-wrap gap-x-1.5 gap-y-0.5">
                    <span className="flex-shrink-0">Picked by:</span>
                    <span className="min-w-0 break-words">
                      {formatVoters(row.voters)}
                    </span>
                  </div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {items.length === 0 && (
        <p className="text-lunar-gold-light/60 text-sm py-4 text-center">
          No dishes yet. Add dishes in Supabase to get started.
        </p>
      )}
    </motion.div>
  );
}
