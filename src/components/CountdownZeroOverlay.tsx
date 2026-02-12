"use client";

import { motion } from "framer-motion";

interface CountdownZeroOverlayProps {
  visible: boolean;
}

export function CountdownZeroOverlay({ visible }: CountdownZeroOverlayProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black z-40 pointer-events-auto"
      aria-hidden
    />
  );
}
