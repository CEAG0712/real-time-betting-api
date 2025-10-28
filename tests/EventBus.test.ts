import redis from "../src/lib/redis";
import { publishBetPlacedEvent } from "../src/service/EventBus";
import { BetPlacedEvent } from "../src/types/Bet";

jest.mock("../src/lib/redis", () => ({
  publish: jest.fn(),
}));

describe("publishBetPlacedEvent", () => {
  const mockBetEvent: BetPlacedEvent = {
    userId: "user123",
    gameId: "gameABC",
    amount: 100,
    odds: 2.5,
    timestamp: 1234567890,
    status: "accepted",
    correlationId: "test-correlation-id",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("publishes to the correct Redis channel", async () => {
    await publishBetPlacedEvent(mockBetEvent);

    expect(redis.publish).toHaveBeenCalledWith(
      "bet:placed",
      JSON.stringify(mockBetEvent)
    );
  });

  it("logs error on Redis publish failure", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (redis.publish as jest.Mock).mockRejectedValueOnce(new Error("Redis failure"));

    await publishBetPlacedEvent(mockBetEvent);

    expect(consoleSpy).toHaveBeenCalledWith("Failed to publish bet:placed event:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
