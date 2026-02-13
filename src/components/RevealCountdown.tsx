"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { REVEAL_START_DATE } from "@/lib/constants";

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

export function RevealCountdown() {
  const { days, hours, minutes, seconds } = useCountdown(REVEAL_START_DATE);
  const allZero = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
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
  );
}
