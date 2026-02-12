"use client";

let drumAudio: HTMLAudioElement | null = null;

/**
 * Play a short ceremonial drum sound when countdown hits zero.
 * Only plays if the document is visible (screen is open).
 * Add a file at public/audio/ceremonial-drum.mp3 or set NEXT_PUBLIC_DRUM_SOUND_URL.
 */
export function playCeremonialDrum(): void {
  if (typeof document === "undefined" || document.visibilityState !== "visible") return;

  try {
    const src =
      process.env.NEXT_PUBLIC_DRUM_SOUND_URL ?? "/audio/ceremonial-drum.mp3";
    if (!drumAudio) {
      drumAudio = new Audio(src);
    }
    drumAudio.currentTime = 0;
    drumAudio.volume = 0.5;
    drumAudio.play().catch(() => {});
  } catch {
    // Ignore if audio fails (e.g. no file, autoplay policy)
  }
}
