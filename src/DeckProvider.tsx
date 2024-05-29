import {createContext, PropsWithChildren, useCallback, useState} from "react";
import deck from "./data/cards";
import {FateCard} from "./data/cards";


type DeckProviderState = {
    deckCards: FateCard[];
    discardCards: FateCard[];
    shuffleDeck: () => void;
    drawCard: (cardId: number) => void;
    replaceCard: (cardId: number) => void;
}

const DeckContext = createContext<DeckProviderState>({
    deckCards: [],
    discardCards: [],
    drawCard: () => null,
    replaceCard: () => null,
    shuffleDeck: () => null
});

export const DeckProvider = ({children}: PropsWithChildren) => {
    const [{deckCards, discardCards}, setCards] = useState({deckCards: deck.cards, discardCards: [] as FateCard[]});

    const shuffleDeck = useCallback(() => {
        setCards({deckCards: deck.cards, discardCards: []});
    }, []);

    const replaceCard = useCallback((cardId: number) => {
        setCards(({
                      deckCards,
                      discardCards
                  }) => ({
            deckCards: [...deckCards, deck.cards.find(card => card.id === cardId)!],
            discardCards: discardCards.filter(card => card.id === cardId)
        }))
    }, [])

    const drawCard = useCallback((cardId: number) => {
        setCards(({
                      deckCards,
                      discardCards
                  }) => ({
            discardCards: [...discardCards, deck.cards.find(card => card.id === cardId)!],
            deckCards: deckCards.filter(card => card.id === cardId)
        }))
    }, [])

    return <DeckContext.Provider
        value={{deckCards, discardCards, drawCard, replaceCard, shuffleDeck}}>{children}</DeckContext.Provider>
}