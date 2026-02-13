"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playRevealSound } from "@/lib/revealSound";
import type { RevealPhase } from "@/hooks/useRevealPhase";

interface TeamRevealProps {
  phase: RevealPhase;
  team: "white" | "black" | null | undefined;
  voted: boolean;
}

export function TeamReveal({ phase, team, voted }: TeamRevealProps) {
  const soundPlayedRef = useRef(false);

  useEffect(() => {
    if (phase === "reveal" && voted && team && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playRevealSound();
    }
  }, [phase, team, voted]);

  if (phase !== "reveal" && phase !== "locked") return null;

  if (phase === "locked") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-lunar-red-deep/95 p-6"
      >
        <p className="font-serif text-2xl sm:text-3xl text-lunar-gold-light text-center max-w-md">
          Listen to the host for gameplay!
        </p>
      </motion.div>
    );
  }

  // phase === "reveal"
  if (!voted || !team) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-lunar-red-deep/95 p-6"
      >
        <p className="font-serif text-xl sm:text-2xl text-lunar-gold-light/90 text-center max-w-md">
          Only voters were chosen.
        </p>
      </motion.div>
    );
  }

  const isBlack = team === "black";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center p-6 ${
        isBlack ? "bg-black/95" : "bg-gradient-to-b from-amber-50/95 to-lunar-gold/20"
      }`}
    >
      {/* Intro message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`text-center text-sm sm:text-base max-w-lg mb-8 ${
          isBlack ? "text-lunar-gold-light/90" : "text-amber-900/90"
        }`}
      >
        Year of the Horse rewards those who are patient.
        <br />
        Here is for entertainment for the upcoming year.
        <br />
        From Panko & Poki.
      </motion.p>

      {/* Team reveal with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 120, damping: 20 }}
        className={`relative px-8 py-6 rounded-2xl border-2 ${
          isBlack
            ? "border-lunar-gold/60 bg-lunar-red-deep/40"
            : "border-amber-400/60 bg-white/30"
        } team-reveal-glow`}
      >
        <p
          className={`font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-center uppercase tracking-wider ${
            isBlack ? "text-lunar-gold-light" : "text-amber-900"
          }`}
        >
          You are Team {team === "black" ? "Black" : "White"}
        </p>
      </motion.div>
    </motion.div>
  );
}
