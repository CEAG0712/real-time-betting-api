import { BetInput } from "../types/Bet";

export type BetDecision =
  | { status: "accepted"; odds: number }
  | { status: "rejected"; reason: string };

export function validateBet(
  input: BetInput,
  recentBetTimestamps: number[]
): BetDecision {
  const MIN_INTERVAL_MS = 5000; // prevent 2 bets within 5 seconds

  const tooSoon = recentBetTimestamps.some(
    (ts) => input.timestamp - ts < MIN_INTERVAL_MS
  );
  if (tooSoon) {
    return { status: "rejected", reason: "Duplicate or too soon" };
  }

  return { status: "accepted", odds: input.odds };

  
}
