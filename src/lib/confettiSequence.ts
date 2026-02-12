"use client";

import confetti from "canvas-confetti";

const GOLD = "#D4AF37";
const RED = "#8B1538";
const DURATION_MS = 2500;

/**
 * Fire gold + red confetti for 2–3 seconds (used in countdown-zero sequence).
 */
export function fireCeremonialConfetti(): void {
  const end = Date.now() + DURATION_MS;
  const colors = [GOLD, RED];

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
