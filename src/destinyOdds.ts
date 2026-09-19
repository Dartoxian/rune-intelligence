import type { FateCard } from "./data/cards";

export type DestinyOutcome = {
  influenceSpent: number;
  redBest: number;
  greyBest: number;
  goldBest: number;
};

/**
 * For each amount of influence spent (i.e. number of fate cards revealed), the probability
 * that the best destiny seen so far is red, grey or gold. Spending zero influence always
 * leaves red as the best outcome.
 */
export const destinyOutcomes = (unseenCards: FateCard[]): DestinyOutcome[] => {
  const total = unseenCards.length;
  const redCards = unseenCards.filter((card) => card.destiny === "red").length;
  const greyCards = unseenCards.filter((card) => card.destiny === "grey").length;
  const goldCards = unseenCards.filter((card) => card.destiny === "gold").length;

  const outcomes: DestinyOutcome[] = [{ influenceSpent: 0, redBest: 1, greyBest: 0, goldBest: 0 }];
  for (let i = 1; i <= total; i += 1) {
    const previous = outcomes[i - 1];
    const remaining = total - i + 1;
    outcomes.push({
      influenceSpent: i,
      // Every card so far is red and the next card is red
      redBest: (previous.redBest * (redCards - i + 1)) / remaining,
      // Either grey is already the best and the next card is not gold, or red is the best and the next card is grey
      greyBest: (previous.greyBest * (remaining - goldCards)) / remaining + (previous.redBest * greyCards) / remaining,
      // Either gold is already the best, or red or grey is the best and the next card is gold
      goldBest: previous.goldBest + ((previous.redBest + previous.greyBest) * goldCards) / remaining,
    });
  }

  return outcomes;
};
