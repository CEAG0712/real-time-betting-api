import { getBetsCollection } from "../lib/mongo";
import { MongoServerError } from "mongodb";

export interface PersistedBet {
  userId: string;
  gameId: string;
  amount: number;
  odds: number;
  timestamp: number;
  status: "accepted";
}

export async function persistBetWithRetry(bet: PersistedBet): Promise<void> {
  const collection = await getBetsCollection();
  const maxAttempts = 3;
  const backoff = [500, 1000, 2000];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await collection.insertOne(bet);
      return;
    } catch (err: unknown) {
      if (err instanceof MongoServerError && err.code === 11000) {
        console.warn("Duplicate insert detected. Skipping.");
        return;
      }

      if (err instanceof Error) {
        console.error(`Insert failed (attempt ${attempt + 1}):`, err.message);
      } else {
        console.error("Insert failed with unknown error:", err);
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, backoff[attempt]));
      } else {
        throw new Error("Insert failed after 3 retries");
      }
    }
  }
}
