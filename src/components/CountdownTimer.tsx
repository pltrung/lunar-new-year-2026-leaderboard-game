"use client";

import { useCountdown, type CountdownParts } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="countdown-digit text-2xl sm:text-3xl font-serif font-semibold text-lunar-gold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-lunar-gold-light/80 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown();

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-3 px-4 rounded-xl bg-lunar-red-deep/60 border border-lunar-gold/30"
      >
        <span className="font-serif text-lg text-lunar-gold">Voting closed</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-3 sm:gap-5 py-3 px-4 rounded-xl bg-lunar-red-deep/50 border border-lunar-gold/20 lantern-glow"
    >
      <Digit value={days} label="Days" />
      <span className="text-lunar-gold/60 text-xl font-serif">:</span>
      <Digit value={hours} label="Hours" />
      <span className="text-lunar-gold/60 text-xl font-serif">:</span>
      <Digit value={minutes} label="Min" />
      <span className="text-lunar-gold/60 text-xl font-serif">:</span>
      <Digit value={seconds} label="Sec" />
    </motion.div>
  );
}
