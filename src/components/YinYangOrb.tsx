"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Remaining seconds until reveal (3 min = 180 max). Used for escalation. */
interface YinYangOrbProps {
  remainingSeconds: number;
  freeze: boolean;
}

// Cycle: 0 = balance, 0.25 = white dominant, 0.5 = balance, 0.75 = black dominant, 1 = balance
function useCycleProgress(freeze: boolean, remainingSeconds: number) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (freeze) return;

    // Escalation: 2–1 min calm (slow), 1 min faster, final 30s return to 50/50
    let cycleMs = 35000;
    if (remainingSeconds <= 30) {
      cycleMs = 999999; // effectively stop dominance swing, hold balance
    } else if (remainingSeconds <= 60) {
      cycleMs = 20000;
    } else if (remainingSeconds <= 120) {
      cycleMs = 28000;
    }

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = (elapsed / cycleMs) % 1;
      setProgress(raw);
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [freeze, remainingSeconds]);

  return progress;
}

// White fraction 0.5 = balance. 0.7–0.8 = white dominant, 0.2–0.3 = black dominant.
function progressToWhiteFraction(cycleProgress: number): number {
  const t = cycleProgress * 2 * Math.PI;
  return 0.5 + 0.28 * Math.sin(t);
}

export function YinYangOrb({ remainingSeconds, freeze }: YinYangOrbProps) {
  const cycleProgress = useCycleProgress(freeze, remainingSeconds);
  const whiteFraction = freeze ? 0.5 : progressToWhiteFraction(cycleProgress);
  const blackFraction = 1 - whiteFraction;

  return (
    <div className="relative flex items-center justify-center py-8 sm:py-12">
      <motion.div
        className="relative w-40 h-40 sm:w-52 sm:h-52"
        animate={{
          scale: freeze ? 1 : [1, 1.04, 1],
          rotate: freeze ? undefined : 360,
        }}
        transition={{
          scale: freeze ? { duration: 0 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          rotate: freeze ? { duration: 0 } : { duration: 24, repeat: Infinity, ease: "linear" },
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <defs>
            <filter id="white-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="black-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* White half: segment 0 to whiteFraction of 360 */}
          <path
            d={describeArc(50, 50, 50, 0, whiteFraction * 360)}
            fill="white"
            filter="url(#white-glow)"
            className="transition-opacity duration-300"
            style={{ opacity: 0.95 + (whiteFraction - 0.5) * 0.2 }}
          />
          {/* Black half */}
          <path
            d={describeArc(50, 50, 50, whiteFraction * 360, 360)}
            fill="#0a0a0a"
            filter="url(#black-glow)"
            className="transition-opacity duration-300"
            style={{ opacity: 0.95 + (blackFraction - 0.5) * 0.2 }}
          />
          {/* Small black dot in white half (center of white wedge) */}
          <circle
            cx={50 + 25 * Math.cos((whiteFraction * Math.PI))}
            cy={50 + 25 * Math.sin((whiteFraction * Math.PI))}
            r="8"
            fill="#0a0a0a"
          />
          {/* Small white dot in black half */}
          <circle
            cx={50 + 25 * Math.cos((whiteFraction + 1) * Math.PI)}
            cy={50 + 25 * Math.sin((whiteFraction + 1) * Math.PI)}
            r="8"
            fill="white"
          />
        </svg>

        {!freeze && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--lunar-gold)]/20 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
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
