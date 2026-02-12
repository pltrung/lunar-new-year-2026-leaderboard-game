"use client";

import { motion } from "framer-motion";

interface HorseGallopProps {
  running: boolean;
  onComplete?: () => void;
}

export function HorseGallop({ running, onComplete }: HorseGallopProps) {
  if (!running) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center"
      initial={false}
    >
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-[min(80vw,320px)] h-24"
        onAnimationComplete={onComplete}
        style={{
          left: "-40%",
          filter: "blur(1px)",
          opacity: 0.85,
        }}
        initial={{ x: 0 }}
        animate={{ x: "140vw" }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {/* Horse silhouette - elegant SVG */}
        <svg
          viewBox="0 0 200 80"
          fill="currentColor"
          className="w-full h-full text-black/90 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          aria-hidden
        >
          <path
            d="M20 60c0-8 6-18 14-22 6-3 12-4 18-2 4 1 8 4 10 8l4 8 2 6-4 2-6-4-4-6-2-4-4 2-2 6 2 6 4 4-2 2-6-2-4-4-2-6 2-4 4-2 2-4-2-2-4 0-2 2 2 4 4 2 2 4 0 4-2 2-4 0-4-2-2-4-2-4 0-6 2-4 4-2 4 0 4 2 2 4 4 2 4 4 2 6 2 4 0 2-2 2-4 0-4-2-2-4-2-2-4 0-4 2-2 4-2 4-2 6 0 4 2 2 4 4 2 6 2 4 0 2-2 2-4 0-4-2-2-4-2-2-4 0-4 2-2 4-2 4-2 6 0 4 2 2 4 4 2 6 2 4 0 2-2 2-4 0-4-2-2-4-2-2-4 0-4 2-2 4-2 4-2 6 0 4 2 2 4 4 2 6 2 4 0 2-2 2-4 0-4-2-2-4-2-2-4 0-4 2-2 4-2 4-2 6 0 4 2 2 4 4 2 6 2 4 0 2-2 2-4 0-4-2-2-4z M140 50c4-2 8-6 10-10 2-4 2-8 0-12-2-4-6-6-10-6-4 0-8 2-10 6-2 4-2 8 0 12 2 4 6 8 10 10 4 2 8 2 12 0 4-2 8-6 10-10 2-4 2-8 0-12-2-4-6-6-10-6-4 0-8 2-10 6-2 4-2 8 0 12 2 4 6 8 10 10z"
            fillRule="evenodd"
          />
          {/* Simpler silhouette: running horse outline */}
          <path
            d="M30 55 L35 35 L50 25 L70 30 L85 22 L100 28 L115 35 L130 45 L145 50 L160 48 L175 42 L185 50 L180 58 L165 62 L150 58 L135 52 L120 55 L105 58 L90 55 L75 52 L60 55 L45 58 L30 55 Z M40 58 L38 62 L42 62 Z M95 58 L93 62 L97 62 Z M150 55 L148 60 L152 60 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
