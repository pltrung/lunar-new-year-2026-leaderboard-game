"use client";

import { motion } from "framer-motion";

interface HorseProgressBarProps {
  /** 0 = start, 1 = finish. Updates every second with countdown. */
  progress: number;
  isExpired: boolean;
  /** True when remaining <= 10 seconds (subtle glow + speed-up easing). */
  isLastTenSeconds: boolean;
}

function countdownPartsToMs(parts: { days: number; hours: number; minutes: number; seconds: number }): number {
  const { days, hours, minutes, seconds } = parts;
  return (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

/** Horse silhouette — minimal side profile (Year of the Horse) */
function HorseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" fill="currentColor" className={className} aria-hidden>
      <path d="M6 20 L8 12 L14 8 L22 10 L30 6 L36 10 L38 16 L36 22 L30 24 L22 22 L14 24 L8 22 L6 20 Z" />
    </svg>
  );
}

/** Finish flag at end of track */
function FinishFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M4 4v16M4 4l12 4-12 4V4z" />
    </svg>
  );
}

export function HorseProgressBar({ progress, isExpired, isLastTenSeconds }: HorseProgressBarProps) {
  const progressClamped = Math.min(1, Math.max(0, progress));
  const horsePositionPercent = progressClamped * 100;

  return (
    <section className="mb-6 w-full max-w-2xl mx-auto px-0 sm:px-0" aria-label="Countdown race track">
      {/* Track container: bar + horse row */}
      <div className="relative w-full">
        {/* Horse (above bar) — positioned by progress */}
        <div className="absolute bottom-full left-0 w-full h-8 sm:h-10 mb-1 pointer-events-none">
          <motion.div
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${horsePositionPercent}%`, x: "-50%" }}
            initial={false}
            animate={{
              left: `${horsePositionPercent}%`,
              x: "-50%",
              transition: isLastTenSeconds
                ? { type: "tween", duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
                : { type: "spring", stiffness: 120, damping: 24 },
            }}
          >
            {/* Dust trail (subtle) — behind horse */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-0.5 -translate-x-6">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-lunar-gold/30"
                  initial={{ opacity: 0.4, scale: 0.8 }}
                  animate={{
                    opacity: [0.2, 0.4],
                    scale: [0.8, 1],
                    transition: { duration: 0.6, repeat: Infinity, delay: i * 0.15 },
                  }}
                />
              ))}
            </div>
            {/* Horse icon */}
            <motion.div
              className={`w-8 h-8 sm:w-10 sm:h-10 text-lunar-gold flex items-center justify-center ${isLastTenSeconds || isExpired ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : ""}`}
              animate={
                isExpired
                  ? {
                      scale: [1, 1.08, 1],
                      transition: { duration: 0.4, ease: "easeOut" },
                    }
                  : {}
              }
            >
              <HorseIcon className="w-full h-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Horizontal track bar */}
        <div
          className="relative w-full h-3 sm:h-4 rounded-full overflow-hidden"
          style={{
            background: "linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.2) 100%)",
            boxShadow: "0 0 12px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Gold progress fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-lunar-gold/70"
            initial={false}
            animate={{ width: `${progressClamped * 100}%` }}
            transition={
              isLastTenSeconds
                ? { type: "tween", duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
                : { type: "spring", stiffness: 100, damping: 22 }
            }
            style={{ boxShadow: "inset 0 0 8px rgba(212,175,55,0.3)" }}
          />
        </div>

        {/* Finish flag at right end */}
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 text-lunar-gold flex items-center justify-center"
          style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.4))" }}
        >
          <FinishFlagIcon className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}

export { countdownPartsToMs };
