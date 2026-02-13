"use client";

import { useEffect, useState, useRef } from "react";
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
import { TitleSection } from "@/components/TitleSection";
import { HorseProgressBar } from "@/components/HorseProgressBar";
import { CountdownZeroOverlay } from "@/components/CountdownZeroOverlay";
import { HorseGallop } from "@/components/HorseGallop";
import { ResultsModal } from "@/components/ResultsModal";
import { playCeremonialDrum } from "@/lib/ceremonialDrum";
import { fireCeremonialConfetti } from "@/lib/confettiSequence";
import { useRevealPhase } from "@/hooks/useRevealPhase";
import { RevealCountdown } from "@/components/RevealCountdown";
import { TeamReveal } from "@/components/TeamReveal";

// Establish session before content mounts so refresh restores vote state
const AUTH_READY_TIMEOUT_MS = 3000;

export default function Home() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let done = false;
    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        setAuthReady(true);
      }
    }, AUTH_READY_TIMEOUT_MS);

    ensureAnonymousAuth()
      .catch(() => {})
      .finally(() => {
        if (!done) {
          done = true;
          setAuthReady(true);
        }
      });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!authReady) {
    return (
      <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col items-center justify-center">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="font-serif text-2xl sm:text-3xl text-lunar-gold-light font-semibold">
            🧧 Lunar New Year Dish Championship 🐎
          </h1>
        </motion.header>
        <p className="text-lunar-gold-light/70 text-sm">Loading…</p>
      </main>
    );
  }

  return <HomeContent />;
}

const SEQUENCE_FREEZE_MS = 500;
const SEQUENCE_HORSE_DURATION_MS = 1200;
const SEQUENCE_CONFETTI_DURATION_MS = 2500;
const SEQUENCE_TOTAL_BEFORE_MODAL_MS =
  SEQUENCE_FREEZE_MS + SEQUENCE_HORSE_DURATION_MS + SEQUENCE_CONFETTI_DURATION_MS;

function HomeContent() {
  const [guestName, setGuestName] = useState("");
  const { phase, isRevealCountdown, isRevealOrLocked } = useRevealPhase();
  const { days, hours, minutes, seconds, isExpired } = useCountdown();
  const initialRemainingMsRef = useRef<number | null>(null);

  const currentRemainingMs = (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  if (!isExpired && initialRemainingMsRef.current === null) {
    initialRemainingMsRef.current = currentRemainingMs;
  }
  const initialMs = initialRemainingMsRef.current ?? 1;
  const progress = isExpired ? 1 : Math.min(1, Math.max(0, 1 - currentRemainingMs / initialMs));
  const isLastTenSeconds = !isExpired && currentRemainingMs <= 10000;

  const { dishes, error: dishesError } = useDishes();
  const { items: leaderboardItems, loading: leaderboardLoading } = useLeaderboardWithVoters();
  const { voted, voteRecord, loading: voteLoading } = useUserVoteStatus();

  // All hooks must run unconditionally (no early return before these)
  const prevExpiredRef = useRef<boolean | undefined>(undefined);
  const sequenceTriggeredRef = useRef(false);
  const expiredOnLoadRef = useRef(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [horseRunning, setHorseRunning] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [sequenceComplete, setSequenceComplete] = useState(false);

  const isFrozen = overlayVisible || horseRunning;

  // Detect "already expired on load" (skip cinematic, show locked + modal only)
  useEffect(() => {
    if (prevExpiredRef.current === undefined) {
      prevExpiredRef.current = isExpired;
      if (isExpired) expiredOnLoadRef.current = true;
    }
  }, [isExpired]);

  // When already expired on load: show results modal once leaderboard is ready (no sequence)
  useEffect(() => {
    if (!expiredOnLoadRef.current || !isExpired || leaderboardLoading) return;
    setShowResultsModal(true);
    setSequenceComplete(true);
  }, [isExpired, leaderboardLoading]);

  // Countdown just hit zero: run cinematic sequence once
  useEffect(() => {
    const justHitZero = prevExpiredRef.current === false && isExpired;
    if (prevExpiredRef.current !== undefined) prevExpiredRef.current = isExpired;

    if (!justHitZero || sequenceTriggeredRef.current || expiredOnLoadRef.current) return;
    sequenceTriggeredRef.current = true;

    const t1 = setTimeout(() => {
      setOverlayVisible(true);
      playCeremonialDrum();
      setHorseRunning(true);
    }, SEQUENCE_FREEZE_MS);

    const t2 = setTimeout(() => {
      setHorseRunning(false);
      fireCeremonialConfetti();
    }, SEQUENCE_FREEZE_MS + SEQUENCE_HORSE_DURATION_MS);

    const t3 = setTimeout(() => {
      setShowResultsModal(true);
      setSequenceComplete(true);
    }, SEQUENCE_TOTAL_BEFORE_MODAL_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isExpired]);

  const votingLocked = isExpired;
  const showNameAtTop = !votingLocked;
  const topThree = leaderboardItems.slice(0, 3);
  const showModal = showResultsModal && (expiredOnLoadRef.current || sequenceTriggeredRef.current);

  // Post-results: team reveal or lock (full-screen layer)
  if (isRevealOrLocked) {
    return (
      <main className="min-h-screen">
        <TeamReveal phase={phase} team={voteRecord?.team ?? null} voted={voted} />
      </main>
    );
  }

  // 15-minute "surprise" countdown — only after sequence/modal has run so confetti isn't skipped
  if (isRevealCountdown && sequenceComplete) {
    return (
      <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-2xl mx-auto">
        <TitleSection />
        <section className="mt-8">
          <RevealCountdown />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-2xl mx-auto relative">
      {/* Countdown-zero cinematic layer */}
      <CountdownZeroOverlay visible={overlayVisible} />
      <HorseGallop
        running={horseRunning}
        onComplete={() => setHorseRunning(false)}
      />
      <ResultsModal open={showModal} topThree={topThree} />

      {/* Freeze interactions during sequence */}
      <div className={isFrozen ? "pointer-events-none select-none" : ""}>
        <TitleSection />

        <HorseProgressBar
          progress={progress}
          isExpired={isExpired}
          isLastTenSeconds={isLastTenSeconds}
        />

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

        <section className="mb-6">
          <CountdownTimer />
        </section>

        <section className="flex flex-col items-center gap-3 mb-8">
          <ParticipationCount />
          <StatusBadge voted={voted} voteRecord={voteRecord} loading={voteLoading} />
        </section>

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

        <section className="mb-8">
          <Leaderboard
            items={leaderboardItems}
            isLocked={votingLocked}
            loading={leaderboardLoading}
            pauseAnimations={isFrozen}
          />
        </section>

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
      </div>
    </main>
  );
}
