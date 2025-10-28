import redis from "../lib/redis";
import { validateBet } from "../core/validateBet";
import { BetInput, PersistedBet } from "../types/Bet";
import { persistBetWithRetry } from "./BetPersistenceService";
// import { v4 as uuidv4 } from "uuid";
import { publishBetPlacedEvent } from "./EventBus";

/**
 * Processes a player bet: validates, persists, and emits event.
 *
 * @param input BetInput object (userId, gameId, amount, odds, timestamp)
 * @returns Response object for controller to return to client
 */
export async function processBet(
  input: BetInput
): Promise<
  { status: "accepted"; odds: number } | { status: "rejected"; reason: string }
> {
  // ✅ Ensure timestamp always exists
  const timestamp = input.timestamp ?? Date.now();
  const key = `bets:${input.userId}`;

  const recent = await redis.lrange(key, 0, -1);
  const recentTimestamps = recent.map(Number);

  const result = validateBet(input, recentTimestamps);

  if (result.status === "accepted") {
    // Store timestamp in Redis for deduplication
    await redis.lpush(key, timestamp.toString());
    await redis.ltrim(key, 0, 4); // Keep only last 5
    await redis.expire(key, 60); // TTL 60s

    const betToPersist: PersistedBet = {
      ...input,
      status: "accepted",
    };

    

    await persistBetWithRetry(betToPersist);

    // ✅ Dynamically import uuid only after success path
    const { v4: uuidv4 } = await import("uuid");
    const correlationId = uuidv4();

    await publishBetPlacedEvent({
      ...betToPersist,
      status: "accepted",
      correlationId,
    });

    return { status: "accepted", odds: result.odds };
  }

  return result;
}
