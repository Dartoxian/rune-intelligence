import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import deck from "./data/cards";
import { FateCard } from "./data/cards";

type FateCardAndStatus = {
  card: FateCard;
  drawn: boolean;
};

type DeckProviderState = {
  cards: FateCardAndStatus[];
  unseenCards: FateCardAndStatus[];
  destinyData: { influenceSpent: number; goldBest: number; redBest: number; greyBest: number }[];
  shuffleDeck: () => void;
  toggleCard: (cardId: number) => void;
};

const DeckContext = createContext<DeckProviderState>({
  cards: [],
  unseenCards: [],
  destinyData: [],
  toggleCard: () => null,
  shuffleDeck: () => null,
});

export const DeckProvider = ({ children }: PropsWithChildren) => {
  const [cards, setCards] = useState<FateCardAndStatus[]>(deck.cards.map((card) => ({ card, drawn: false })));

  const shuffleDeck = useCallback(() => {
    setCards(deck.cards.map((card) => ({ card, drawn: false })));
  }, []);

  const toggleCard = useCallback((cardId: number) => {
    setCards((cards) => cards.map((card) => (card.card.id === cardId ? { ...card, drawn: !card.drawn } : card)));
  }, []);

  const unseenCards = useMemo(() => cards.filter((c) => !c.drawn), [cards]);

  const destinyData = useMemo(() => {
    const redCards = unseenCards.filter((card) => card.card.destiny === "red").length;
    const greyCards = unseenCards.filter((card) => card.card.destiny === "grey").length;
    const goldCards = unseenCards.filter((card) => card.card.destiny === "gold").length;

    const ithOutcomes = [{ influenceSpent: 0, redBest: 1, greyBest: 0, goldBest: 0 }];
    for (let i = 1; i <= unseenCards.length; i += 1) {
      ithOutcomes.push({
        influenceSpent: i,
        // Every card so far is red and the next card is red
        redBest: (ithOutcomes[i - 1].redBest * (redCards - i + 1)) / (unseenCards.length - i + 1),
        // Either gray is already the best and the next card is not gold, or red is the best and the next card is gray
        greyBest:
          (ithOutcomes[i - 1].greyBest * (unseenCards.length - i + 1 - goldCards)) / (unseenCards.length - i + 1) +
          (ithOutcomes[i - 1].redBest * greyCards) / (unseenCards.length - i + 1),
        // Either gold is already the best, or red or gray is the best and the next card is gold
        goldBest:
          ithOutcomes[i - 1].goldBest +
          ((ithOutcomes[i - 1].redBest + ithOutcomes[i - 1].greyBest) * goldCards) / (unseenCards.length - i + 1),
      });
    }

    return ithOutcomes;
  }, [unseenCards]);

  return (
    <DeckContext.Provider value={{ cards, unseenCards, destinyData, toggleCard, shuffleDeck }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  return useContext(DeckContext);
};
