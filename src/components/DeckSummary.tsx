import { useDeck } from "../DeckProvider";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export const DeckSummary = () => {
  const { cards, shuffleDeck } = useDeck();
  const deckCards = useMemo(() => {
    return cards.filter((card) => !card.drawn);
  }, [cards]);

  return (
    <Flex flexDirection={"column"} alignItems={"center"} minH={"0"}>
      <Text as={"h2"} fontSize={"1.5rem"}>
        Cards in deck:
      </Text>
      <Text marginTop={"-2.5rem"} marginBottom={"-1rem"} fontSize={"5.5rem"}>
        {deckCards.length}
      </Text>
      <Button onClick={shuffleDeck}>Shuffle Deck</Button>
    </Flex>
  );
};
