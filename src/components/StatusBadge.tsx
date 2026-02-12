"use client";

import { motion } from "framer-motion";

interface StatusBadgeProps {
  voted: boolean;
  voteRecord: { guestName?: string | null } | null;
  loading: boolean;
}

export function StatusBadge({ voted, voteRecord }: StatusBadgeProps) {
  if (voted) {
    const name = voteRecord?.guestName?.trim() || "Guest";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lunar-gold/20 border border-lunar-gold/40"
      >
        <span className="text-sm font-medium text-lunar-gold-light">
          You voted as {name}
        </span>
        <span aria-hidden>🎉</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lunar-red-light/20 border border-lunar-red-light/40"
    >
      <span className="text-sm font-medium text-lunar-gold-light/90">
        You have not cast your vote yet
      </span>
    </motion.div>
  );
}
