"use client";

import { motion } from "framer-motion";

interface HorseProgressBarProps {
  /** 0 = start, 1 = finish. Updates every second with countdown. */
  progress: number;
  isExpired: boolean;
  /** True when remaining <= 10 seconds. */
  isLastTenSeconds: boolean;
}

/** Running horse silhouette facing RIGHT (toward finish). Metallic gold gradient + shadow. */
function HorseSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 44"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="horse-gold"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f8e27a" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8960c" />
        </linearGradient>
        <filter id="horse-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Horse body + head (facing right): nose left, tail right */}
      <g filter="url(#horse-shadow)">
        {/* Single path: running horse facing right — head left, tail right */}
        <path
          fill="url(#horse-gold)"
          d="M6 26 L8 22 L10 18 L14 14 L18 12 L22 12 L26 14 L30 16 L34 14 L40 16 L44 20 L46 22 L50 20 L54 22 L56 26 L54 30 L52 32 L50 30 L48 28 L46 30 L44 34 L42 36 L38 34 L36 32 L34 34 L30 36 L26 34 L24 32 L22 34 L18 36 L14 34 L12 30 L10 28 L8 30 L6 26 Z"
        />
      </g>
    </svg>
  );
}

/** Finish flag — gold gradient */
function FinishFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <defs>
        <linearGradient id="progress-bar-flag-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f8e27a" />
        </linearGradient>
      </defs>
      <path d="M4 4v16M4 4l12 4-12 4V4z" stroke="url(#progress-bar-flag-gold)" />
    </svg>
  );
}

export function HorseProgressBar({ progress, isExpired, isLastTenSeconds }: HorseProgressBarProps) {
  const progressClamped = Math.min(1, Math.max(0, progress));
  const horsePositionPercent = progressClamped * 100;

  return (
    <section className="mb-6 w-full max-w-2xl mx-auto" aria-label="Countdown race track">
      <div className="relative w-full">
        {/* ----- Horse row: positioned by transform (GPU-friendly) ----- */}
        <div className="absolute bottom-full left-0 w-full h-10 sm:h-12 mb-1 pointer-events-none overflow-visible">
          <motion.div
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${horsePositionPercent}%` }}
            initial={false}
            animate={{
              left: `${horsePositionPercent}%`,
              x: "-50%",
              transition: isLastTenSeconds
                ? { type: "tween", duration: 0.7, ease: [0.2, 0, 0.2, 1] }
                : { type: "spring", stiffness: 100, damping: 22 },
            }}
          >
            {/* Golden dust particles behind horse */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#f8e27a] opacity-40"
                  style={{ left: `${i * 6}px`, top: `${(i % 2) * 4 - 2}px` }}
                  animate={{
                    opacity: [0.15, 0.4, 0.15],
                    scale: [0.6, 1, 0.6],
                    transition: { duration: 0.8, repeat: Infinity, delay: i * 0.2 },
                  }}
                />
              ))}
            </div>

            {/* Horse + shadow + bob + finish burst */}
            <motion.div
              className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${isLastTenSeconds || isExpired ? "horse-glow" : ""} ${isLastTenSeconds ? "horse-motion-blur" : ""}`}
              animate={
                isExpired
                  ? {
                      x: [0, 8, 0],
                      transition: { duration: 0.35, ease: "easeOut" },
                    }
                  : {
                      y: [0, -2, 0],
                      transition: {
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
            >
              <HorseSilhouette />
            </motion.div>
          </motion.div>
        </div>

        {/* ----- Track: dark red gradient, gold outline, inner glow, dashed lanes ----- */}
        <motion.div
          className={`relative w-full h-4 sm:h-5 rounded-lg overflow-hidden border border-[#d4af37]/50 ${isLastTenSeconds ? "track-glow-intense" : ""}`}
          style={{
            background: "linear-gradient(90deg, #5c0011 0%, #7a001a 50%, #4a000d 100%)",
            boxShadow:
              "0 0 0 1px rgba(212,175,55,0.35), 0 0 16px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)",
          }}
        >
          {/* Brushed texture overlay (very subtle) */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
            }}
          />
          {/* Dashed lane markings */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 px-2 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-0.5 flex-1 max-w-[8%] border-t border-dashed border-[#d4af37]/25"
              />
            ))}
          </div>
          {/* Progress fill — gradient gold */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-l-md rounded-r-sm overflow-hidden"
            initial={false}
            animate={{ width: `${progressClamped * 100}%` }}
            transition={
              isLastTenSeconds
                ? { type: "tween", duration: 0.7, ease: [0.2, 0, 0.2, 1] }
                : { type: "spring", stiffness: 90, damping: 22 }
            }
            style={{
              background: "linear-gradient(90deg, #d4af37 0%, #f8e27a 50%, #d4af37 100%)",
              boxShadow: "inset 0 0 12px rgba(248,226,122,0.25)",
            }}
          />
        </motion.div>

        {/* Finish flag + golden flash when countdown hits 0 */}
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 text-[#f8e27a] flex items-center justify-center z-10"
          style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.5))" }}
        >
          <FinishFlagIcon className="w-full h-full" />
        </div>
        {isExpired && (
          <motion.div
            className="absolute top-0 right-0 w-16 h-full rounded-l-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.2, 1.2] }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(248,226,122,0.4))",
              boxShadow: "inset -20px 0 30px rgba(248,226,122,0.3)",
            }}
          />
        )}
      </div>
    </section>
  );
}

export function countdownPartsToMs(parts: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): number {
  const { days, hours, minutes, seconds } = parts;
  return (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}
