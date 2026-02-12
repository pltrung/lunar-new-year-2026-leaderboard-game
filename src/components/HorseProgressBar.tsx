"use client";

import { motion } from "framer-motion";

interface HorseProgressBarProps {
  progress: number;
  isExpired: boolean;
  isLastTenSeconds: boolean;
}

/** Running horse silhouette facing RIGHT. Metallic gold, shadow beneath. */
function HorseSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 44" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="horse-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8e27a" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8960c" />
        </linearGradient>
        {/* Soft shadow directly beneath horse (grounded) */}
        <filter id="horse-ground-shadow" x="-30%" y="-10%" width="160%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#horse-ground-shadow)">
        <path
          fill="url(#horse-gold)"
          d="M6 26 L8 22 L10 18 L14 14 L18 12 L22 12 L26 14 L30 16 L34 14 L40 16 L44 20 L46 22 L50 20 L54 22 L56 26 L54 30 L52 32 L50 30 L48 28 L46 30 L44 34 L42 36 L38 34 L36 32 L34 34 L30 36 L26 34 L24 32 L22 34 L18 36 L14 34 L12 30 L10 28 L8 30 L6 26 Z"
        />
      </g>
    </svg>
  );
}

/** Finish flag — gold, subtle shimmer every 3s */
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

/** Golden dust sparks: 2–3 particles, fade back, short lifespan */
function DustSparks() {
  return (
    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 w-8 h-2 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#f8e27a]"
          style={{
            left: `${i * 8}px`,
            top: "50%",
            marginTop: "-4px",
            filter: "blur(1px)",
            boxShadow: "0 0 6px rgba(248,226,122,0.5)",
          }}
          animate={{
            opacity: [0.5, 0.25, 0],
            scale: [1, 0.75, 0.5],
            x: [0, -4, -8],
            transition: {
              duration: 0.65,
              repeat: Infinity,
              delay: i * 0.22,
              ease: "easeOut",
            },
          }}
        />
      ))}
    </div>
  );
}

export function HorseProgressBar({ progress, isExpired, isLastTenSeconds }: HorseProgressBarProps) {
  const progressClamped = Math.min(1, Math.max(0, progress));
  const horsePositionPercent = progressClamped * 100;

  return (
    <section className="mb-6 w-full max-w-2xl mx-auto" aria-label="Countdown race track">
      <div className="relative w-full pt-2">
        {/* Horse row: hooves overlap track top, vertically centered to track */}
        <div
          className="absolute left-0 w-full h-16 sm:h-[4.5rem] pointer-events-none overflow-visible"
          style={{ bottom: "100%", marginBottom: "-6px" }}
        >
          <motion.div
            className="absolute top-0 flex flex-col items-center justify-end"
            style={{ left: `${horsePositionPercent}%`, height: "100%" }}
            initial={false}
            animate={{
              left: `${horsePositionPercent}%`,
              x: "-50%",
              transition: isLastTenSeconds
                ? { type: "tween", duration: 0.7, ease: [0.2, 0, 0.2, 1] }
                : { type: "spring", stiffness: 100, damping: 24 },
            }}
          >
            {/* Dust: 2–3 golden sparks behind horse, fading back */}
            <DustSparks />

            {/* Horse: ~1.8x size, bob + tilt + leg illusion, grounded on track */}
            <motion.div
              className={`relative flex items-end justify-center w-[3.5rem] h-[3.5rem] sm:w-[4.5rem] sm:h-[4.5rem] ${isLastTenSeconds || isExpired ? "horse-glow" : ""} ${isLastTenSeconds ? "horse-motion-blur" : ""}`}
              animate={
                isExpired
                  ? {
                      x: [0, 10, 0],
                      transition: { duration: 0.35, ease: "easeOut" },
                    }
                  : {
                      y: [0, -3, 0],
                      rotate: [0, -0.8, 0],
                      scaleY: [1, 1.02, 1],
                      transition: {
                        duration: 0.55,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
            >
              <div className="w-full h-full flex items-end justify-center pb-0.5">
                <HorseSilhouette className="w-full h-full object-contain" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Track: recessed, inner shadow, metallic sheen */}
        <motion.div
          className={`relative w-full h-5 sm:h-6 rounded-lg overflow-hidden border border-[#d4af37]/40 ${isLastTenSeconds ? "track-glow-intense" : ""}`}
          style={{
            background: "linear-gradient(180deg, #6a0015 0%, #5c0011 40%, #4a000d 100%)",
            boxShadow:
              "0 0 0 1px rgba(212,175,55,0.3), 0 0 12px rgba(212,175,55,0.1), inset 0 2px 4px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Metallic sheen overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06] rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }}
          />
          {/* Dashed lane markings */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 px-2 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-0.5 flex-1 max-w-[8%] border-t border-dashed border-[#d4af37]/20" />
            ))}
          </div>
          {/* Progress fill */}
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
              boxShadow: "inset 0 0 14px rgba(248,226,122,0.2)",
            }}
          />
        </motion.div>

        {/* Finish flag: glow + shimmer */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center z-10 finish-flag-glow">
          <FinishFlagIcon className="w-full h-full text-[#f8e27a] finish-flag-shimmer" />
        </div>

        {isExpired && (
          <motion.div
            className="absolute top-0 right-0 w-20 h-full rounded-l-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.15, 1.15] }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(248,226,122,0.35))",
              boxShadow: "inset -24px 0 28px rgba(248,226,122,0.25)",
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
