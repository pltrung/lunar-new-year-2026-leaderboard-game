"use client";

import { useVotesCount } from "@/hooks/useVotesCount";
import { motion } from "framer-motion";

export function ParticipationCount() {
  const { votedCount, total } = useVotesCount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <span className="font-serif text-lunar-gold-light text-sm sm:text-base">
        <span className="font-semibold text-lunar-gold">{votedCount}</span>
        <span className="text-lunar-gold-light/90"> / {total} Guests Voted</span>
      </span>
    </motion.div>
  );
}
