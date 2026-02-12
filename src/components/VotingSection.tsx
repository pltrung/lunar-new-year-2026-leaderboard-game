"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitVote } from "@/lib/vote";
import type { Dish } from "@/types";

interface VotingSectionProps {
  dishes: Dish[];
  disabled: boolean;
  voted: boolean;
  votingLocked: boolean;
  voteRecord: { guestName?: string | null } | null;
  onVoteSuccess: () => void;
}

export function VotingSection({
  dishes,
  disabled,
  voted,
  votingLocked,
  voteRecord,
  onVoteSuccess,
}: VotingSectionProps) {
  const [guestName, setGuestName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (disabled || submitting) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 2) next.add(id);
      return next;
    });
    setError(null);
  };

  const handleSubmit = async () => {
    const name = guestName?.trim();
    if (!name || selected.size !== 2 || submitting || disabled) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitVote([...selected] as [string, string], name);
      setJustSubmitted(true);
      onVoteSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      console.error("Vote submit error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    guestName?.trim().length > 0 &&
    selected.size === 2 &&
    !submitting &&
    !disabled;

  if (disabled || justSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-lunar-red-deep/40 border border-lunar-gold/20 p-6 text-center"
      >
        {voted && !justSubmitted && (
          <p className="text-xs text-lunar-gold-light/70 mb-2">You already voted. To vote again, use a different device or incognito window.</p>
        )}
        {justSubmitted || (voted && !votingLocked) ? (
          <p className="font-serif text-lunar-gold-light">
            You voted as {(justSubmitted ? guestName?.trim() : voteRecord?.guestName) || "Guest"} 🎉
          </p>
        ) : (
          <p className="font-serif text-lunar-gold-light">
            Voting is closed. Thanks for participating!
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="rounded-2xl bg-lunar-red-deep/40 border border-lunar-gold/20 p-4 sm:p-6 lantern-glow"
    >
      <h2 className="font-serif text-xl sm:text-2xl text-lunar-gold mb-2">
        Pick your top 2 dishes
      </h2>

      <div className="mb-4 p-3 rounded-xl bg-lunar-gold/10 border border-lunar-gold/30">
        <label htmlFor="guest-name" className="block text-sm font-semibold text-lunar-gold mb-1.5">
          Your name (required to vote)
        </label>
        <input
          id="guest-name"
          type="text"
          placeholder="Enter your name to vote"
          value={guestName}
          onChange={(e) => {
            setGuestName(e.target.value);
            setError(null);
          }}
          maxLength={80}
          className="w-full px-4 py-3 rounded-xl bg-lunar-red/20 border-2 border-lunar-gold/20 text-lunar-gold-light placeholder:text-lunar-gold-light/50 focus:border-lunar-gold/50 focus:outline-none"
          disabled={submitting}
          autoComplete="name"
        />
      </div>

      <p className="text-sm text-lunar-gold-light/80 mb-4">
        Select exactly 2 dishes, then submit your vote.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6">
        <AnimatePresence mode="popLayout">
          {dishes.map((dish) => {
            const isSelected = selected.has(dish.id);
            return (
              <motion.button
                key={dish.id}
                layout
                type="button"
                onClick={() => toggle(dish.id)}
                disabled={submitting}
                className={`
                  text-left p-3 sm:p-4 rounded-xl border-2 transition-all
                  font-medium
                  ${isSelected
                    ? "bg-lunar-gold/25 border-lunar-gold text-lunar-gold-light shadow-lg"
                    : "bg-lunar-red/20 border-lunar-gold/20 text-lunar-gold-light/90 hover:border-lunar-gold/40 hover:bg-lunar-red/30"
                  }
                `}
              >
                {dish.name}
                {isSelected && (
                  <span className="ml-2 text-lunar-gold" aria-hidden>
                    ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-300 text-sm mb-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`
          w-full py-3 rounded-xl font-serif font-semibold text-lg
          transition-all
          ${canSubmit
            ? "bg-lunar-gold text-lunar-red-deep hover:bg-lunar-gold-light shadow-lg"
            : "bg-lunar-gold/20 text-lunar-gold-light/50 cursor-not-allowed"
          }
        `}
      >
        {submitting ? "Submitting…" : "Submit Vote"}
      </motion.button>
    </motion.div>
  );
}
