import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import deck from "./data/cards";
import type { FateCard } from "./data/cards";
import { destinyOutcomes, DestinyOutcome } from "./destinyOdds";

type FateCardAndStatus = {
  card: FateCard;
  drawn: boolean;
};

type DeckProviderState = {
  cards: FateCardAndStatus[];
  unseenCards: FateCardAndStatus[];
  destinyData: DestinyOutcome[];
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

const freshDeck = (): FateCardAndStatus[] => deck.cards.map((card) => ({ card, drawn: false }));

const getInitCards = (): FateCardAndStatus[] => {
  const stored = localStorage.getItem("fateCards");
  if (stored) {
    try {
      return JSON.parse(stored) as FateCardAndStatus[];
    } catch {
      // Unreadable storage just means we start from a full deck.
    }
  }
  return freshDeck();
};

export const DeckProvider = ({ children }: PropsWithChildren) => {
  const [cards, setCards] = useState<FateCardAndStatus[]>(getInitCards);

  useEffect(() => {
    localStorage.setItem("fateCards", JSON.stringify(cards));
  }, [cards]);

  const shuffleDeck = useCallback(() => {
    setCards(freshDeck());
  }, []);

  const toggleCard = useCallback((cardId: number) => {
    setCards((cards) => cards.map((card) => (card.card.id === cardId ? { ...card, drawn: !card.drawn } : card)));
  }, []);

  const unseenCards = useMemo(() => cards.filter((c) => !c.drawn), [cards]);

  const destinyData = useMemo(() => destinyOutcomes(unseenCards.map((c) => c.card)), [unseenCards]);

  return (
    <DeckContext.Provider value={{ cards, unseenCards, destinyData, toggleCard, shuffleDeck }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  return useContext(DeckContext);
};
