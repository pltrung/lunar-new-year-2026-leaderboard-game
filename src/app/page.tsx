"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAnonymousAuth } from "@/lib/supabase";
import { useCountdown } from "@/hooks/useCountdown";
import { useDishes } from "@/hooks/useDishes";
import { useLeaderboardWithVoters } from "@/hooks/useLeaderboardWithVoters";
import { useUserVoteStatus } from "@/hooks/useUserVoteStatus";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ParticipationCount } from "@/components/ParticipationCount";
import { StatusBadge } from "@/components/StatusBadge";
import { Leaderboard } from "@/components/Leaderboard";
import { VotingSection } from "@/components/VotingSection";
import { Confetti } from "@/components/Confetti";

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [guestName, setGuestName] = useState("");
  const { isExpired } = useCountdown();
  const { dishes, error: dishesError } = useDishes();
  const { items: leaderboardItems, loading: leaderboardLoading } = useLeaderboardWithVoters();
  const { voted, voteRecord, loading: voteLoading } = useUserVoteStatus();

  useEffect(() => {
    ensureAnonymousAuth().catch(() => {});
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
  const showNameAtTop = !votingLocked;

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

      {/* Name at top: input before vote, "Hi Name" after */}
      {showNameAtTop && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-2xl bg-lunar-gold/10 border border-lunar-gold/30"
        >
          {voted && (voteRecord?.guestName?.trim() || guestName.trim()) ? (
            <p className="text-center text-lunar-gold font-serif font-medium">
              Hi, {(voteRecord?.guestName?.trim() || guestName.trim()) || "Guest"}
            </p>
          ) : (
            <>
              <label htmlFor="guest-name-top" className="block text-sm font-semibold text-lunar-gold mb-2 text-center">
                Your name (enter first, then pick dishes below)
              </label>
              <input
                id="guest-name-top"
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl bg-lunar-red/20 border-2 border-lunar-gold/20 text-lunar-gold-light placeholder:text-lunar-gold-light/50 focus:border-lunar-gold/50 focus:outline-none text-center"
                autoComplete="name"
              />
            </>
          )}
        </motion.section>
      )}

      {/* Countdown */}
      <section className="mb-6">
        <CountdownTimer />
      </section>

      {/* Participation + Status */}
      <section className="flex flex-col items-center gap-3 mb-8">
        <ParticipationCount />
        <StatusBadge voted={voted} voteRecord={voteRecord} loading={voteLoading} />
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

      {/* Leaderboard (top 5 with who picked) */}
      <section className="mb-8">
        <Leaderboard
          items={leaderboardItems}
          isLocked={votingLocked}
          loading={leaderboardLoading}
        />
      </section>

      {/* Voting */}
      <section>
        <VotingSection
          dishes={dishes}
          dishesError={dishesError}
          disabled={voted || votingLocked}
          voted={voted}
          votingLocked={votingLocked}
          voteRecord={voteRecord}
          guestNameFromTop={guestName}
          setGuestNameFromTop={setGuestName}
          onVoteSuccess={() => {}}
        />
      </section>
    </main>
  );
}
