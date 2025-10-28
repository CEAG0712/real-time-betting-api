import { PersistedBet } from "../types/Bet";
import { getBetsCollection } from "../lib/mongo";

interface MongoErrorWithCode extends Error {
  code?: number;
}

function isMongoDuplicateKeyError(err: unknown): err is MongoErrorWithCode {
  return (
    err instanceof Error &&
    typeof (err as MongoErrorWithCode).code === "number" &&
    (err as MongoErrorWithCode).code === 11000
  );
}

export async function persistBetWithRetry(bet: PersistedBet): Promise<void> {
  const collection = await getBetsCollection();

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await collection.insertOne(bet);
      console.log("Bet persisted:", bet);
      return;
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        console.warn("Duplicate insert prevented:", err.message);
        return;
      }

      console.error(`Insert attempt ${attempt} failed:`, err);

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 100));
      } else {
        throw new Error("Failed to persist bet after 3 attempts");
      }
    }
  }
}
