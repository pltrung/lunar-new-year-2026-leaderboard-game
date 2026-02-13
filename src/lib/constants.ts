// TODO REVERT: Test — 6:45 PM PST today. For real event use: 2026-02-15T21:00:00-08:00 (Sunday 9 PM)
export const VOTING_END_DATE = new Date("2026-02-12T18:45:00-08:00");

// Team reveal starts 15 minutes after voting ends (9:15 PM Pacific)
export const REVEAL_START_DATE = new Date(VOTING_END_DATE.getTime() + 15 * 60 * 1000);

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
