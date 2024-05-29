import {createContext, PropsWithChildren, useCallback, useContext, useState} from "react";
import deck from "./data/cards";
import {FateCard} from "./data/cards";


type FateCardAndStatus = {
    card: FateCard;
    drawn: boolean;
}

type DeckProviderState = {
    cards: FateCardAndStatus[];
    shuffleDeck: () => void;
    toggleCard: (cardId: number) => void;
}

const DeckContext = createContext<DeckProviderState>({
    cards: [],
    toggleCard: () => null,
    shuffleDeck: () => null
});

export const DeckProvider = ({children}: PropsWithChildren) => {
    const [cards, setCards] = useState<FateCardAndStatus[]>(deck.cards.map(card => ({card, drawn: false})));

    const shuffleDeck = useCallback(() => {
        setCards(deck.cards.map(card => ({card, drawn: false})));
    }, []);

    const toggleCard = useCallback((cardId: number) => {
        setCards(cards => cards.map(card => card.card.id === cardId ? {...card, drawn: !card.drawn} : card));
    }, [])

    return <DeckContext.Provider
        value={{cards, toggleCard, shuffleDeck}}>{children}</DeckContext.Provider>
}

export const useDeck = () => {
    return useContext(DeckContext)
}