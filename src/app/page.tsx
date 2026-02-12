"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAnonymousAuth } from "@/lib/supabase";
import { useCountdown } from "@/hooks/useCountdown";
import { useDishes } from "@/hooks/useDishes";
import { useUserVoteStatus } from "@/hooks/useUserVoteStatus";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ParticipationCount } from "@/components/ParticipationCount";
import { StatusBadge } from "@/components/StatusBadge";
import { Leaderboard } from "@/components/Leaderboard";
import { VotingSection } from "@/components/VotingSection";
import { Confetti } from "@/components/Confetti";

export default function Home() {
  const [authReady, setAuthReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isExpired } = useCountdown();
  const { dishes, loading: dishesLoading } = useDishes();
  const { voted, voteRecord, loading: voteLoading } = useUserVoteStatus();

  useEffect(() => {
    ensureAnonymousAuth().then(() => setAuthReady(true));
  }, []);

  // One-time confetti when voting closes
  useEffect(() => {
    if (!isExpired) return;
    const key = "lunar-confetti-shown";
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      setShowConfetti(true);
    }
  }, [isExpired]);

  const votingLocked = isExpired;

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-2xl mx-auto">
      {showConfetti && <Confetti />}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-lunar-gold-light font-semibold leading-tight">
          🧧 Lunar New Year Dish Championship 🐎
        </h1>
        <p className="text-lunar-gold-light/80 text-sm mt-2">
          Vote for your top 2 dishes
        </p>
      </motion.header>

      {/* Countdown */}
      <section className="mb-6">
        <CountdownTimer />
      </section>

      {/* Participation + Status */}
      <section className="flex flex-col items-center gap-3 mb-8">
        <ParticipationCount />
        {authReady && (
          <StatusBadge voted={voted} voteRecord={voteRecord} loading={voteLoading} />
        )}
      </section>

      {/* Locked / Winners banner */}
      <AnimatePresence>
        {votingLocked && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-2xl bg-lunar-gold/15 border-2 border-lunar-gold/40 p-4 text-center"
          >
            <p className="font-serif text-xl text-lunar-gold">
              Voting Closed! Winners Announced!
            </p>
            <p className="text-lunar-gold-light/90 text-sm mt-1">
              🏆 1st · 🥈 2nd · 🥉 3rd below
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Leaderboard */}
      <section className="mb-8">
        <Leaderboard
          dishes={dishes}
          isLocked={votingLocked}
          loading={dishesLoading}
        />
      </section>

      {/* Voting */}
      {authReady && (
        <section>
          <VotingSection
            dishes={dishes}
            disabled={voted || votingLocked}
            voted={voted}
            votingLocked={votingLocked}
            voteRecord={voteRecord}
            onVoteSuccess={() => {}}
          />
        </section>
      )}

      {!authReady && (
        <div className="text-center py-8 text-lunar-gold-light/60">
          Loading…
        </div>
      )}
    </main>
  );
}
