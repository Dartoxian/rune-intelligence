import { describe, expect, it } from "vitest";
import { toPercent } from "./utils";

describe("toPercent", () => {
  it("renders a fraction as a whole-number percentage", () => {
    expect(toPercent(0.5)).toBe("50%");
    expect(toPercent(0)).toBe("0%");
    expect(toPercent(1)).toBe("100%");
  });

  it("rounds to the nearest whole percent", () => {
    expect(toPercent(0.12345)).toBe("12%");
    expect(toPercent(0.129)).toBe("13%");
  });
});
