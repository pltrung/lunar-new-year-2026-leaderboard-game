"use client";

let revealAudio: HTMLAudioElement | null = null;

/**
 * Play a subtle sound when team is revealed (only if tab is visible).
 * Add a file at public/audio/reveal.mp3 or set NEXT_PUBLIC_REVEAL_SOUND_URL.
 */
export function playRevealSound(): void {
  if (typeof document === "undefined" || document.visibilityState !== "visible") return;
  try {
    const src = process.env.NEXT_PUBLIC_REVEAL_SOUND_URL ?? "/audio/reveal.mp3";
    if (!revealAudio) revealAudio = new Audio(src);
    revealAudio.currentTime = 0;
    revealAudio.volume = 0.4;
    revealAudio.play().catch(() => {});
  } catch {
    // ignore
  }
}
