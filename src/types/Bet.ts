export interface BetInput {
  userId: string;
  gameId: string;
  amount: number;
  odds: number;
  timestamp: number;
}

// Final shape of bet as persisted in MongoDB
export interface PersistedBet extends BetInput {
  status: "accepted" | "rejected" | "settled";
}