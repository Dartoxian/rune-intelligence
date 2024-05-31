import { Box, Flex, Text } from "@chakra-ui/react";
import { DestinyOutcomeChart } from "./DestinyOutcomeChart";
import * as React from "react";
import { ReactElement, useMemo } from "react";
import { useDeck } from "../DeckProvider";

export const Destiny = () => {
  const { unseenCards, destinyData } = useDeck();
  const statements = useMemo(() => {
    const r: (ReactElement | string)[] = [];

    const totalCount = unseenCards.length;
    const goldCount = unseenCards.filter(({ card }) => card.destiny === "gold").length;
    const redCount = unseenCards.filter(({ card }) => card.destiny === "red").length;
    const greyCount = unseenCards.filter(({ card }) => card.destiny === "grey").length;

    r.push(`There are ${goldCount} gold, ${greyCount} grey, ${redCount} red unseen destiny cards.`);

    if (goldCount === 0) {
      r.push(
        <>
          It is <b>IMPOSSIBLE</b> to pull a gold card
        </>,
      );
    } else if (goldCount / totalCount < 0.15) {
      r.push(
        <>
          It is <b>very unlikely</b> you will pull a gold card
        </>,
      );
    } else {
      const minSpentForEvenOdds = Math.min(...destinyData.filter((d) => d.goldBest > 0.5).map((d) => d.influenceSpent));
      const minSpentForStrongOdds = Math.min(
        ...destinyData.filter((d) => d.goldBest > 0.75).map((d) => d.influenceSpent),
      );

      r.push(
        <>
          Reveal <b>{minSpentForEvenOdds}</b> fates for even odds of gold, or <b>{minSpentForStrongOdds}</b> for strong
          odds.
        </>,
      );
    }

    if (goldCount + greyCount === 0) {
      r.push(
        <>
          It is <b>IMPOSSIBLE</b> to pull a non red card
        </>,
      );
    } else if ((goldCount + greyCount) / totalCount < 0.15) {
      r.push(
        <>
          It is <b>very unlikely</b> you will pull a non red card
        </>,
      );
    } else {
      const minSpentForEvenOdds = Math.min(
        ...destinyData.filter((d) => d.goldBest + d.greyBest > 0.5).map((d) => d.influenceSpent),
      );
      const minSpentForStrongOdds = Math.min(
        ...destinyData.filter((d) => d.goldBest + d.greyBest > 0.75).map((d) => d.influenceSpent),
      );

      r.push(
        <>
          Reveal <b>{minSpentForEvenOdds}</b> fates for even odds of non red, or <b>{minSpentForStrongOdds}</b> for
          strong odds.
        </>,
      );
    }

    return r;
  }, [unseenCards, destinyData]);

  return (
    <Flex flex={"1"} flexDirection={"column"} bg={"gray.700"} m={"8px"} p={"8px"} borderRadius={"5px"}>
      <Text fontSize={"2xl"} textAlign={"center"}>
        Destiny
      </Text>
      <Box flex={"5"} minH={"0"}>
        <DestinyOutcomeChart />
      </Box>
      <Box flex={"2"}>
        <Box as={"ul"} fontSize={"xl"} paddingLeft={"30px"}>
          {statements.map((s, i) => (
            <Text as={"li"} key={i}>
              {s}
            </Text>
          ))}
        </Box>
      </Box>
    </Flex>
  );
};
