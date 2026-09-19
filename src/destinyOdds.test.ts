import { describe, expect, it } from "vitest";
import { destinyOutcomes } from "./destinyOdds";
import deck from "./data/cards";
import type { FateCard, FateDestiny } from "./data/cards";

const cardOf = (id: number, destiny: FateDestiny): FateCard => ({
  id,
  triangle: null,
  rectangle: null,
  hexagon: null,
  circle: null,
  destiny,
});

const deckOf = (...destinies: FateDestiny[]): FateCard[] => destinies.map((destiny, i) => cardOf(i + 1, destiny));

describe("destinyOutcomes", () => {
  it("treats red as the best outcome before any influence is spent", () => {
    expect(destinyOutcomes([])).toEqual([{ influenceSpent: 0, redBest: 1, greyBest: 0, goldBest: 0 }]);
  });

  it("returns one outcome per card that could be revealed, plus the zero-influence case", () => {
    expect(destinyOutcomes(deckOf("red", "grey", "gold"))).toHaveLength(4);
  });

  it("never improves on red when every unseen card is red", () => {
    const outcomes = destinyOutcomes(deckOf("red", "red", "red"));

    expect(outcomes.map((o) => o.redBest)).toEqual([1, 1, 1, 1]);
    expect(outcomes.every((o) => o.greyBest === 0 && o.goldBest === 0)).toBe(true);
  });

  it("guarantees gold once every unseen card has been revealed", () => {
    const outcomes = destinyOutcomes(deckOf("red", "gold"));

    expect(outcomes[1]).toEqual({ influenceSpent: 1, redBest: 0.5, greyBest: 0, goldBest: 0.5 });
    expect(outcomes[2]).toEqual({ influenceSpent: 2, redBest: 0, greyBest: 0, goldBest: 1 });
  });

  it("is impossible to beat red when no grey or gold remains", () => {
    const outcomes = destinyOutcomes(deckOf("red", "red"));

    expect(outcomes[outcomes.length - 1].goldBest).toBe(0);
  });

  it("produces a probability distribution at every influence level for the real deck", () => {
    for (const outcome of destinyOutcomes(deck.cards)) {
      expect(outcome.redBest + outcome.greyBest + outcome.goldBest).toBeCloseTo(1, 10);
      expect(Math.min(outcome.redBest, outcome.greyBest, outcome.goldBest)).toBeGreaterThanOrEqual(0);
    }
  });
});
