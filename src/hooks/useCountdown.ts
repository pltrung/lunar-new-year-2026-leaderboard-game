"use client";

import { useState, useEffect } from "react";
import { VOTING_END_DATE } from "@/lib/constants";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function getRemaining(target: Date): CountdownParts {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isExpired: false };
}

export function useCountdown(targetDate: Date = VOTING_END_DATE): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => getRemaining(targetDate));

  useEffect(() => {
    const tick = () => setParts(getRemaining(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate.getTime()]);

  return parts;
}
