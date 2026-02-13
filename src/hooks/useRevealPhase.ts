"use client";

import { useState, useEffect } from "react";
import { VOTING_END_DATE, REVEAL_START_DATE } from "@/lib/constants";

export type RevealPhase = "voting" | "reveal_countdown" | "reveal" | "locked";

const REVEAL_DISPLAY_MS = 15 * 60 * 1000; // 15 minutes of team reveal, then "Listen to host"

function getPhase(now: number): RevealPhase {
  if (now < VOTING_END_DATE.getTime()) return "voting";
  if (now < REVEAL_START_DATE.getTime()) return "reveal_countdown";
  const elapsed = now - REVEAL_START_DATE.getTime();
  if (elapsed < REVEAL_DISPLAY_MS) return "reveal";
  return "locked";
}

export function useRevealPhase(): {
  phase: RevealPhase;
  isRevealCountdown: boolean;
  isRevealOrLocked: boolean;
} {
  const [phase, setPhase] = useState<RevealPhase>(() => getPhase(Date.now()));

  useEffect(() => {
    const tick = () => setPhase(getPhase(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return {
    phase,
    isRevealCountdown: phase === "reveal_countdown",
    isRevealOrLocked: phase === "reveal" || phase === "locked",
  };
}
