import { useDeck } from "../DeckProvider";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";

export const DeckSummary = () => {
  const { cards, shuffleDeck } = useDeck();
  const deckCards = useMemo(() => {
    return cards.filter((card) => !card.drawn);
  }, [cards]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const handleShuffle = () => {
    shuffleDeck();
    onClose();
  };

  return (
    <Flex flexDirection={"column"} alignItems={"center"} minH={"0"}>
      <Text as={"h2"} fontSize={"1.5rem"}>
        Cards in deck:
      </Text>
      <Text marginTop={"-2.5rem"} marginBottom={"-1rem"} fontSize={"5.5rem"}>
        {deckCards.length}
      </Text>
      <Button onClick={onOpen}>Shuffle Deck</Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Shuffle Fate Deck
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleShuffle} ml={3}>
                Shuffle
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
