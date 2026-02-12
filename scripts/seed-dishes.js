/**
 * Dish names for the Lunar New Year game.
 * Seed these in Firestore (see README):
 *   Collection: dishes
 *   Each document: { name: string, votes: number } (start with votes: 0)
 */

const DISH_NAMES = [
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

console.log("Add these dishes in Firebase Console > Firestore > dishes collection:");
DISH_NAMES.forEach((name, i) => {
  console.log(`  ${i + 1}. name: "${name}", votes: 0`);
});
