"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Remaining seconds until reveal (3 min = 180 max). Used for escalation. */
interface YinYangOrbProps {
  remainingSeconds: number;
  freeze: boolean;
}

// Ease in-out for organic transitions
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Maps cycle progress 0..1 to white fraction (0 = all black, 1 = all white).
 * Cycle: 50/50 → white 70–90% → almost full white → 50/50 → black 70–90% → almost full black → 50/50.
 */
function cycleProgressToWhiteFraction(progress: number): number {
  const p = progress;
  if (p <= 0.14) return 0.5 + 0.38 * easeInOutCubic(p / 0.14); // 0.5 → 0.88
  if (p <= 0.21) return 0.88 + 0.08 * easeInOutCubic((p - 0.14) / 0.07); // 0.88 → 0.96
  if (p <= 0.35) return 0.96 - 0.46 * easeInOutCubic((p - 0.21) / 0.14); // 0.96 → 0.5
  if (p <= 0.5) return 0.5; // hold balance
  if (p <= 0.64) return 0.5 - 0.38 * easeInOutCubic((p - 0.5) / 0.14); // 0.5 → 0.12
  if (p <= 0.71) return 0.12 - 0.08 * easeInOutCubic((p - 0.64) / 0.07); // 0.12 → 0.04
  if (p <= 0.85) return 0.04 + 0.46 * easeInOutCubic((p - 0.71) / 0.14); // 0.04 → 0.5
  return 0.5; // hold balance to end of cycle
}

function useCycleProgress(freeze: boolean, remainingSeconds: number) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (freeze) return;

    // Escalation: 3–2 min slow, 2–1 min faster, final 30s hold 50/50
    let cycleMs = 45000; // 3–2 min: calm
    if (remainingSeconds <= 30) {
      cycleMs = 999999; // hold balance
    } else if (remainingSeconds <= 60) {
      cycleMs = 28000; // 2–1 min: faster
    } else if (remainingSeconds <= 120) {
      cycleMs = 38000;
    }

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = (elapsed / cycleMs) % 1;
      setProgress(raw);
    };
    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [freeze, remainingSeconds]);

  return progress;
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

export function YinYangOrb({ remainingSeconds, freeze }: YinYangOrbProps) {
  const cycleProgress = useCycleProgress(freeze, remainingSeconds);
  const whiteFraction = freeze ? 0.5 : cycleProgressToWhiteFraction(cycleProgress);
  const blackFraction = 1 - whiteFraction;

  // Glow: gold accent; shift intensity by dominant side (white dominant = slightly brighter gold)
  const goldIntensity = 0.15 + (whiteFraction - 0.5) * 0.15;
  const rotationDuration = remainingSeconds <= 30 ? "60s" : "45s";

  return (
    <div className="relative flex items-center justify-center py-8 sm:py-12">
      <motion.div
        className="relative w-44 h-44 sm:w-56 sm:h-56"
        animate={{
          scale: freeze ? 1 : [1, 1.03, 1],
        }}
        transition={{
          scale: freeze ? { duration: 0 } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          filter: `drop-shadow(0 0 24px rgba(212,175,55,${goldIntensity})) drop-shadow(0 12px 28px rgba(0,0,0,0.6))`,
        }}
      >
        <div
          className={`w-full h-full animate-yin-rotate ${freeze ? "yin-rotate-paused" : ""}`}
          style={{ ["--yin-duration" as string]: rotationDuration }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="white-depth" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="85%" stopColor="#f5f5f5" />
                <stop offset="100%" stopColor="#e8e8e8" />
              </radialGradient>
              <radialGradient id="black-depth" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="85%" stopColor="#111111" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>
            {/* White half: wedge from 0 to whiteFraction * 360 */}
            <path
              d={describeArc(50, 50, 50, 0, whiteFraction * 360)}
              fill="url(#white-depth)"
              style={{ transition: "opacity 0.4s ease" }}
            />
            {/* Black half */}
            <path
              d={describeArc(50, 50, 50, whiteFraction * 360, 360)}
              fill="url(#black-depth)"
              style={{ transition: "opacity 0.4s ease" }}
            />
            {/* Small black dot in white half */}
            <circle
              cx={50 + 25 * Math.cos((whiteFraction * Math.PI))}
              cy={50 + 25 * Math.sin((whiteFraction * Math.PI))}
              r="7"
              fill="#111111"
            />
            {/* Small white dot in black half */}
            <circle
              cx={50 + 25 * Math.cos((whiteFraction + 1) * Math.PI)}
              cy={50 + 25 * Math.sin((whiteFraction + 1) * Math.PI)}
              r="7"
              fill="#ffffff"
            />
          </svg>
        </div>

        {!freeze && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--lunar-gold)]/25 pointer-events-none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
}
