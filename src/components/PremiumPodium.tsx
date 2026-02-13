"use client";

import { motion } from "framer-motion";
import type { LeaderboardRow } from "@/hooks/useLeaderboardWithVoters";

const PLACES = [
  { place: 1, medal: "🥇", label: "1st Place", scale: 1.05, shine: true, glowClass: "shadow-[0_0_24px_rgba(212,175,55,0.5),inset_0_0_20px_rgba(212,175,55,0.08)]" },
  { place: 2, medal: "🥈", label: "2nd Place", scale: 1, shine: false, glowClass: "shadow-[0_0_20px_rgba(192,192,192,0.4)]" },
  { place: 3, medal: "🥉", label: "3rd Place", scale: 1, shine: false, glowClass: "shadow-[0_0_20px_rgba(205,127,50,0.4)]" },
] as const;

interface PremiumPodiumProps {
  topThree: LeaderboardRow[];
}

export function PremiumPodium({ topThree }: PremiumPodiumProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-gradient-to-b from-[#5C0A1F] to-[#3d0615] border border-[var(--lunar-gold)]/50 shadow-lg p-6 sm:p-8"
    >
      <h2 className="font-serif text-xl sm:text-2xl text-[var(--lunar-gold)] font-semibold text-center mb-1">
        It&apos;s time for rewards for the winners
      </h2>
      <p className="font-serif text-sm text-[var(--lunar-gold-light)]/80 text-center mb-6">
        Top 3 dishes — Year of the Horse
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {PLACES.map((p, index) => (
          <PodiumColumn
            key={p.place}
            place={p}
            dishName={topThree[index]?.name ?? "—"}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}

function PodiumColumn({
  place,
  dishName,
  index,
}: {
  place: (typeof PLACES)[number];
  dishName: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.4 }}
      className={`relative flex flex-col items-center justify-center rounded-xl border border-[var(--lunar-gold)]/30 bg-[var(--lunar-red-deep)]/60 py-6 px-4 min-h-[120px] sm:min-h-[140px] overflow-hidden ${place.glowClass}`}
      style={{ transform: `scale(${place.scale})` }}
    >
      {place.shine && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--lunar-gold)]/25 to-transparent" />
        </motion.div>
      )}
      <span className="text-2xl sm:text-3xl mb-1" aria-hidden>
        {place.medal}
      </span>
      <span className="font-serif text-xs sm:text-sm uppercase tracking-wider text-[var(--lunar-gold-light)]/90">
        {place.label}
      </span>
      <span className="font-serif text-base sm:text-lg text-[var(--lunar-gold-light)] font-medium text-center mt-1 truncate w-full">
        {dishName}
      </span>
    </motion.div>
  );
}
