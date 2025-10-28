import { validateBet } from "../src/core/validateBet";
import { BetInput } from "../src/types/Bet";

describe("validateBet", () => {
  it("accepts first bet", () => {
    const input: BetInput = {
      userId: "user1",
      gameId: "game1",
      amount: 100,
      odds: 2.5,
      timestamp: 10000,
    };
    const result = validateBet(input, []);
    expect(result.status).toBe("accepted");
  });

  it("rejects duplicate within 5 seconds", () => {
    const input: BetInput = {
      userId: "user1",
      gameId: "game1",
      amount: 100,
      odds: 2.5,
      timestamp: 10500,
    };
    const recent = [10000];
    const result = validateBet(input, recent);
    expect(result.status).toBe("rejected");
  });
});
