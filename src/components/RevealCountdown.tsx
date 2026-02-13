"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { REVEAL_START_DATE } from "@/lib/constants";
import type { LeaderboardRow } from "@/hooks/useLeaderboardWithVoters";
import { PremiumPodium } from "@/components/PremiumPodium";
import { YinYangOrb } from "@/components/YinYangOrb";

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--lunar-gold)] tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-[var(--lunar-gold-light)]/80 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

interface RevealCountdownProps {
  topThree: LeaderboardRow[];
}

export function RevealCountdown({ topThree }: RevealCountdownProps) {
  const { minutes, seconds, isExpired } = useCountdown(REVEAL_START_DATE);
  const remainingSeconds = minutes * 60 + seconds;
  const allZero = isExpired || (minutes === 0 && seconds === 0);
  const freeze = allZero;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Premium Winner Podium (red theme) */}
      <section className="px-4 sm:px-6">
        <PremiumPodium topThree={topThree} />
      </section>

      {/* 2. Large 3-minute countdown */}
      <section className="px-4 sm:px-6 mt-8 text-center">
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-4 px-6 rounded-2xl bg-gradient-to-b from-[#5C0A1F] to-[#3d0615] border border-[var(--lunar-gold)]/40 shadow-lg inline-flex">
          <Digit value={minutes} label="Min" />
          <span className="text-[var(--lunar-gold)]/60 text-2xl">:</span>
          <Digit value={seconds} label="Sec" />
        </div>
      </section>

      {/* 3. Suspense subtitle */}
      <p className="font-serif text-center text-[var(--lunar-gold)]/90 text-sm sm:text-base mt-6 px-4">
        The Horse Watches Balance.
      </p>

      {/* 4. Yin-Yang section: deep black background, orb centerpiece */}
      <section className="relative mt-8 sm:mt-12 bg-black rounded-2xl mx-4 sm:mx-6 py-10 sm:py-14">
        <YinYangOrb remainingSeconds={remainingSeconds} freeze={freeze} />
      </section>

      {/* Transition at 0: dim overlay when frozen */}
      {freeze && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/25 pointer-events-none z-40"
          aria-hidden
        />
      )}
    </div>
  );
}
