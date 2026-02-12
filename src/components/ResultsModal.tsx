"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LeaderboardRow } from "@/hooks/useLeaderboardWithVoters";

interface ResultsModalProps {
  open: boolean;
  topThree: LeaderboardRow[];
}

const MEDALS = ["🥇", "🥈", "🥉"] as const;
const PLACES = ["1st Place", "2nd Place", "3rd Place"] as const;

export function ResultsModal({ open, topThree }: ResultsModalProps) {
  return (
    <AnimatePresence>
      {open && (
      <motion.div
        key="results-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
      >
        <motion.div
          id="results-title"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 24,
              mass: 0.8,
            },
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-2xl border-2 border-lunar-gold/80 bg-lunar-red-deep/95 shadow-[0_0_40px_rgba(212,175,55,0.25),0_25px_50px_-12px_rgba(0,0,0,0.5)] p-6 sm:p-8 text-center"
        >
          <h2 className="font-serif text-2xl sm:text-3xl text-lunar-gold-light font-semibold mb-1">
            🏆 RESULTS ARE IN! 🐎
          </h2>
          <div className="mt-6 space-y-3">
            {topThree.map((row, index) => (
              <div
                key={row.id}
                className="flex items-center justify-center gap-3 py-2"
              >
                <span className="text-2xl" aria-hidden>
                  {MEDALS[index]}
                </span>
                <span className="font-serif text-lg text-lunar-gold-light">
                  {PLACES[index]}: {row.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 font-serif text-lunar-gold text-base">
            🎊 Congratulations to our winning chefs!
          </p>
          <p className="mt-2 font-serif italic text-lunar-gold-light/90 text-sm">
            Year of the Horse — Year of the Chase!
          </p>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
