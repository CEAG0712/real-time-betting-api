import redis from "../lib/redis";
import { BetPlacedEvent } from "../types/Bet";

export async function publishBetPlacedEvent(
  event: BetPlacedEvent
): Promise<void> {
  try {
    const channel = "bet:placed";
    const payload = JSON.stringify(event);

    await redis.publish(channel, payload);
    console.log("📣 Published bet:placed event:", event);
  } catch (error) {
    console.error("Failed to publish bet:placed event:", error);
  }
}
