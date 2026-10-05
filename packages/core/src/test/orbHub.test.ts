import { describe, expect, it } from "vitest";
import { lagSlot, ORB_MAX_LAG_MS } from "../components/orbHub";

describe("lagSlot", () => {
  it("returns nothing before the first frame has been saved", () => {
    expect(lagSlot(0, 1000)).toBeNull();
  });

  it("a tile with no lag shows the newest frame", () => {
    expect(lagSlot(10, 0)).toBe(9);
  });

  it("a lagging tile shows an older frame, one slot per ~33ms", () => {
    expect(lagSlot(100, 330)).toBe(89); // 10 frames behind the newest (99)
  });

  it("everyone shows the first frame until history has built up", () => {
    expect(lagSlot(3, 4000)).toBe(0);
    expect(lagSlot(1, 2000)).toBe(0);
  });

  it("never reaches back past the ring: a long lag clamps to the oldest frame still kept", () => {
    const slots = Math.ceil(ORB_MAX_LAG_MS / 33) + 2;
    const captured = slots * 3 + 5;
    const oldestKept = captured - slots;
    expect(lagSlot(captured, 1e9)).toBe(oldestKept % slots);
  });

  it("different lags give different frames once history exists, which is what desynchronises the tiles", () => {
    const frames = new Set([0, 700, 1400, 2100, 2800, 3500].map((ms) => lagSlot(500, ms)));
    expect(frames.size).toBe(6);
  });
});
