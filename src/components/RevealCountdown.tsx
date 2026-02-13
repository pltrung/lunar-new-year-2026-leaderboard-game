"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { REVEAL_START_DATE } from "@/lib/constants";
import type { LeaderboardRow } from "@/hooks/useLeaderboardWithVoters";

const revealTimeLabel = REVEAL_START_DATE.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl sm:text-2xl font-serif font-semibold text-lunar-gold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-lunar-gold-light/80 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

const PODIUM_STYLES = [
  { place: 2, medal: "🥈", label: "2nd", glow: "shadow-[0_0_30px_rgba(192,192,192,0.6)]", border: "border-gray-400/80", bg: "bg-gradient-to-b from-gray-200/30 to-gray-400/20", height: "h-28 sm:h-32" },
  { place: 1, medal: "🥇", label: "1st", glow: "shadow-[0_0 40px_rgba(212,175,55,0.7),0_0_80px_rgba(212,175,55,0.3)]", border: "border-amber-400/90", bg: "bg-gradient-to-b from-amber-200/40 to-amber-500/30", height: "h-36 sm:h-44" },
  { place: 3, medal: "🥉", label: "3rd", glow: "shadow-[0_0_30px_rgba(205,127,50,0.6)]", border: "border-amber-700/80", bg: "bg-gradient-to-b from-amber-800/30 to-amber-900/20", height: "h-24 sm:h-28" },
] as const;

interface RevealCountdownProps {
  topThree: LeaderboardRow[];
}

export function RevealCountdown({ topThree }: RevealCountdownProps) {
  const { days, hours, minutes, seconds } = useCountdown(REVEAL_START_DATE);
  const allZero = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <div className="space-y-8">
      {/* Winners headline + Olympic podium */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-lunar-red-deep/60 border-2 border-lunar-gold/40 p-6 sm:p-8 text-center"
      >
        <h2 className="font-serif text-2xl sm:text-3xl text-lunar-gold font-bold mb-1">
          It&apos;s time for rewards for the winners!
        </h2>
        <p className="text-lunar-gold-light/90 text-sm sm:text-base mb-8">
          🏆 Top 3 dishes — Year of the Horse
        </p>

        {/* Podium: 2nd (left), 1st (center), 3rd (right) */}
        <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-lg mx-auto">
          {PODIUM_STYLES.map((style, index) => {
            const row = topThree[index];
            return (
              <motion.div
                key={style.place}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.15, type: "spring", stiffness: 200, damping: 22 }}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-full rounded-t-xl border-2 ${style.border} ${style.bg} ${style.glow} ${style.height} flex flex-col items-center justify-end pb-2 sm:pb-3 px-2`}
                >
                  <span className="text-3xl sm:text-4xl mb-1" aria-hidden>
                    {style.medal}
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-lunar-gold-light uppercase tracking-wide">
                    {style.label} place
                  </span>
                  <span className="font-serif text-base sm:text-lg text-lunar-gold-light/95 font-medium truncate w-full text-center">
                    {row?.name ?? "—"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Countdown to next surprise */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-lunar-red-deep/50 border border-lunar-gold/30 p-6 sm:p-8 text-center"
      >
        <h2 className="font-serif text-xl sm:text-2xl text-lunar-gold-light mb-1">
          The Horse Tests Patience
        </h2>
        <p className="text-lunar-gold-light/80 text-sm sm:text-base mb-6">
          A new surprise begins at {revealTimeLabel}
        </p>
        {!allZero ? (
          <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 px-4 rounded-xl bg-lunar-red/20 border border-lunar-gold/20">
            <Digit value={days} label="Days" />
            <span className="text-lunar-gold/60">:</span>
            <Digit value={hours} label="Hours" />
            <span className="text-lunar-gold/60">:</span>
            <Digit value={minutes} label="Min" />
            <span className="text-lunar-gold/60">:</span>
            <Digit value={seconds} label="Sec" />
          </div>
        ) : (
          <p className="text-lunar-gold-light/70 text-sm py-2">Starting soon…</p>
        )}
      </motion.section>
    </div>
  );
}
