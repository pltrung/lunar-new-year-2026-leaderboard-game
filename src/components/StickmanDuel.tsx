"use client";

import { motion } from "framer-motion";

interface StickmanDuelProps {
  freeze: boolean;
}

const DURATION = 20;

export function StickmanDuel({ freeze }: StickmanDuelProps) {
  return (
    <div className="relative flex items-end justify-center gap-8 sm:gap-16 py-8 sm:py-12 min-h-[140px]">
      {/* Left: black silhouette */}
      <motion.div
        className="relative origin-bottom"
        animate={freeze ? {} : { x: [0, 24, -8, 24, 0] }}
        transition={{
          duration: DURATION,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <Stickman color="black" mirror={false} freeze={freeze} />
      </motion.div>

      {/* Right: white silhouette */}
      <motion.div
        className="relative origin-bottom"
        animate={freeze ? {} : { x: [0, -24, 8, -24, 0] }}
        transition={{
          duration: DURATION,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <Stickman color="white" mirror={true} freeze={freeze} />
      </motion.div>
    </div>
  );
}

function Stickman({
  color,
  mirror,
  freeze,
}: {
  color: "black" | "white";
  mirror: boolean;
  freeze: boolean;
}) {
  const fill = color === "black" ? "#0a0a0a" : "#fafafa";
  const stroke = color === "black" ? "#1a1a1a" : "#e5e5e5";

  return (
    <motion.svg
      viewBox="0 0 60 100"
      className="h-24 w-14 sm:h-28 sm:w-16"
      style={{ transform: mirror ? "scaleX(-1)" : undefined }}
    >
      {/* Head */}
      <circle cx="30" cy="12" r="10" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Torso */}
      <line
        x1="30"
        y1="22"
        x2="30"
        y2="52"
        stroke={fill}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Left arm */}
      <line x1="30" y1="32" x2="12" y2="38" stroke={fill} strokeWidth="3" strokeLinecap="round" />
      {/* Right arm */}
      <line x1="30" y1="32" x2="48" y2="38" stroke={fill} strokeWidth="3" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="30" y1="52" x2="18" y2="88" stroke={fill} strokeWidth="3" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="30" y1="52" x2="42" y2="88" stroke={fill} strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  );
}
