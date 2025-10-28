import express from "express";
import { handleBetPlacement } from "../controller/BetController";

const router = express.Router();

router.post("/", handleBetPlacement);

export default router;

