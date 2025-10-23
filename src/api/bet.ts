import express from "express";
import redis from "../lib/redis";
import { BetInput, validateBet } from "../core/validateBet";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, gameId, amount } = req.body;

  if (!userId || !gameId || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const key = `bets:${userId}`;
  const timestamp = Date.now();

  const recent = await redis.lrange(key, 0, -1);
  const recentTimestamps = recent.map(Number);

  const result = validateBet(
    { userId, gameId, amount, timestamp },
    recentTimestamps
  );

  if (result.status === "accepted") {
    await redis.lpush(key, timestamp);
    await redis.ltrim(key, 0, 4); // keep last 5
    await redis.expire(key, 60); // TTL 60s
  }

  return res.json(result);
});

export default router;
