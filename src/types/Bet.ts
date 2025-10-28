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

// Event published to Redis (or other pub/sub systems)
export interface BetPlacedEvent {
  correlationId: string; // Unique per request, enables tracing
  userId: string;
  gameId: string;
  amount: number;
  odds: number;
  timestamp: number;
  status: "accepted"; // Only "accepted" bets are published
}