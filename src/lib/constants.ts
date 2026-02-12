// Sunday 9:00 PM PST — Feb 15, 2026 for "Lunar New Year 2026" event
// Use PST (America/Los_Angeles) so 9PM is consistent
const REAL_END_DATE = new Date("2026-02-15T21:00:00-08:00");

// Optional: set NEXT_PUBLIC_TEST_COUNTDOWN_MINUTES=10 in .env.local to test the countdown-zero sequence (countdown ends in 10 mins). Remove for production.
function getVotingEndDate(): Date {
  const mins = typeof process.env.NEXT_PUBLIC_TEST_COUNTDOWN_MINUTES !== "undefined"
    ? Number(process.env.NEXT_PUBLIC_TEST_COUNTDOWN_MINUTES)
    : 0;
  if (mins > 0 && Number.isFinite(mins)) {
    return new Date(Date.now() + mins * 60 * 1000);
  }
  return REAL_END_DATE;
}

export const VOTING_END_DATE = getVotingEndDate();

export const TOTAL_GUESTS = 14;

// Seed dish names — edit as needed for your event
export const DEFAULT_DISHES = [
  "Spring Rolls",
  "Dumplings",
  "Fish (Nián Nián Yǒu Yú)",
  "Nian Gao",
  "Longevity Noodles",
  "Buddha's Delight",
  "Tangyuan",
  "Turnip Cake",
  "Eight Treasure Rice",
  "Hot Pot",
  "Rice Cakes",
  "Sweet Rice Balls",
];
