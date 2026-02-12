"use client";

import { motion } from "framer-motion";

export function TitleSection() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-lunar-gold-light font-semibold leading-tight max-w-2xl mx-auto">
        🧧 Welcome to Panko & Poki&apos;s Lunar New Year 2026 Horse Dish Competition
      </h1>
      <p className="text-lunar-gold-light/90 text-base sm:text-lg mt-3 font-serif italic">
        <span className="text-lunar-gold font-semibold not-italic">
          Year of the Horse. Year of the Chase.
        </span>
      </p>
      <p className="text-lunar-gold-light/80 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
        Top 3 dishes win prizes.
        <br className="sm:hidden" />
        If one chef dominates, we roll down to the next highest dish so 3 different families take home rewards.
      </p>
      <p className="text-lunar-gold-light/90 text-sm sm:text-base mt-3 font-serif">
        Let the Horse run. 🐎🔥
      </p>
    </motion.header>
  );
}
