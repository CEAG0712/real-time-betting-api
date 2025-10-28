import { Request, Response } from "express";
import { processBet } from "../service/BetService";

export async function handleBetPlacement(req: Request, res: Response) {
  try {
    const result = await processBet(req.body); // assumed to be BetInput
    res.status(result.status === "accepted" ? 200 : 429).json(result);
  } catch (err) {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
