import { useDeck } from "../DeckProvider";
import { Button, Grid, GridItem, Image } from "@chakra-ui/react";
import { FateDestiny } from "../data/cards";
import { useMemo } from "react";

export const CardGrid = () => {
  const { cards } = useDeck();

  return (
    <Grid templateColumns={"repeat(10, 1fr)"} columnGap={"0.25rem"} rowGap={"0.25rem"}>
      {cards.map((card, i) => (
        <GridItem key={card.card.id} w={"100%"}>
          <CardButton cardId={i + 1} />
        </GridItem>
      ))}
    </Grid>
  );
};

type CardButtonProps = {
  cardId: number;
};

const CardButton = ({ cardId }: CardButtonProps) => {
  const { cards, toggleCard } = useDeck();
  const { card: fateCard, drawn } = cards.find((card) => card.card.id === cardId)!;

  return (
    <Button
      w={"100%"}
      h={"3rem"}
      onClick={() => toggleCard(cardId)}
      colorScheme={drawn ? "gray" : "orange"}
      bg={drawn ? undefined : "orange.700"}
      fontSize={"1.3rem"}
    >
      <DestinyImage destiny={fateCard.destiny} />
      {cardId}
    </Button>
  );
};

type DestinyImageProps = {
  destiny: FateDestiny;
};

const DestinyImage = ({ destiny }: DestinyImageProps) => {
  return <Image w={"15px"} marginRight={"8px"} src={`${process.env.PUBLIC_URL}/images/destiny-${destiny}.png`} />;
};
