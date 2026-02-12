export interface Dish {
  id: string;
  name: string;
  votes: number;
}

export interface VoteRecord {
  userId: string;
  selected: [string, string];
  createdAt: string;
  guestName?: string | null;
}

export type RankChange = "up" | "down" | "same" | "new";

export interface DishWithRank extends Dish {
  rank: number;
  previousRank?: number;
  rankChange?: RankChange;
}
