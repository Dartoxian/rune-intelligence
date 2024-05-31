import {
  Box,
  Button,
  Flex,
  Image,
  Table,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";

import * as React from "react";
import deck from "../data/cards";
import { useDeck } from "../DeckProvider";
import { ReactElement, useMemo } from "react";
import { toPercent } from "./utils";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { RuneLog } from "./RuneLog";

const combatTypes = ["triangle", "rectangle", "circle", "hexagon"] as const;
type CombatType = (typeof combatTypes)[number];
type CombatOdds = {
  combatType: CombatType;
  blank: number;
  blankBase: number;
  damage: number;
  damageBase: number;
  route: number;
  routeBase: number;
  special: number;
  specialBase: number;
};

const baseDeck = deck.cards;
export const Combat = () => {
  const { unseenCards } = useDeck();

  const odds = useMemo(() => {
    const totalCards = baseDeck.length;
    const totalUnseen = unseenCards.length;
    return combatTypes.map(
      (combatType): CombatOdds => ({
        combatType,
        blank: unseenCards.filter(({ card }) => card[combatType] === null).length / totalUnseen,
        blankBase: baseDeck.filter((card) => card[combatType] === null).length / totalCards,
        damage:
          unseenCards.filter(({ card }) => card[combatType] !== null && card[combatType]!.type === "damage").length /
          totalUnseen,
        damageBase:
          baseDeck.filter((card) => card[combatType] !== null && card[combatType]!.type === "damage").length /
          totalCards,
        route:
          unseenCards.filter(({ card }) => card[combatType] !== null && card[combatType]!.type === "route").length /
          totalUnseen,
        routeBase:
          baseDeck.filter((card) => card[combatType] !== null && card[combatType]!.type === "route").length /
          totalCards,
        special:
          unseenCards.filter(({ card }) => card[combatType] !== null && card[combatType]!.type === "special").length /
          totalUnseen,
        specialBase:
          baseDeck.filter((card) => card[combatType] !== null && card[combatType]!.type === "special").length /
          totalCards,
      }),
    );
  }, [unseenCards]);

  const statements = useMemo(() => {
    const r: (string | ReactElement)[] = [];
    odds.forEach((odd) => {
      const failureModification = 1 - odd.blank / odd.blankBase;

      if (failureModification > 0.25) {
        r.push(
          <>
            <Image display={"inline"} w={"24px"} src={`/images/${odd.combatType}.png`} /> is{" "}
            {failureModification > 0.5 && <b>much </b>}
            more likely to succeed.
          </>,
        );
      }
      if (failureModification < -0.25) {
        r.push(
          <>
            <Image display={"inline"} w={"24px"} src={`/images/${odd.combatType}.png`} /> is{" "}
            {failureModification < -0.5 && <b>much </b>}
            less likely to succeed.
          </>,
        );
      }
    });
    return r;
  }, [odds]);

  return (
    <Flex flex={"1"} flexDirection={"column"} justifyContent={"space-between"} mb={"24px"}>
      <Flex
        flex={"1"}
        flexDirection={"column"}
        borderWidth={"2px"}
        borderStyle={"solid"}
        borderColor={"gray.=800"}
        m={"8px"}
        p={"8px"}
        borderRadius={"5px"}
      >
        <Text fontSize={"2xl"} textAlign={"center"}>
          Combat
        </Text>
        <Table mb={"16px"}>
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "22.5%", background: useToken("colors", "gray.900") }} />
            <col style={{ width: "22.5%" }} />
            <col style={{ width: "22.5%" }} />
            <col style={{ width: "22.5%" }} />
          </colgroup>
          <Thead>
            <Tr>
              <Th />
              <Th>Blank</Th>
              <Th>
                <Image w={"20px"} src={"/images/damage.png"} />
              </Th>
              <Th>
                <Image w={"20px"} src={"/images/route.png"} />
              </Th>
              <Th>
                <Image w={"20px"} src={"/images/special.png"} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {odds.map((odd) => (
              <Tr key={odd.combatType}>
                <Td>
                  <Image w={"20px"} src={`/images/${odd.combatType}.png`} />
                </Td>
                <Td>
                  {toPercent(odd.blank)} <PercentDiffTag invert value={odd.blank} baseValue={odd.blankBase} />
                </Td>
                <Td>
                  {toPercent(odd.damage)} <PercentDiffTag value={odd.damage} baseValue={odd.damageBase} />
                </Td>
                <Td>
                  {toPercent(odd.route)} <PercentDiffTag value={odd.route} baseValue={odd.routeBase} />
                </Td>
                <Td>
                  {toPercent(odd.special)} <PercentDiffTag value={odd.special} baseValue={odd.specialBase} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box as={"ul"} fontSize={"xl"} paddingLeft={"30px"}>
          {statements.map((s, i) => (
            <Text key={i} as={"li"}>
              {s}
            </Text>
          ))}
        </Box>
      </Flex>
      <RuneLog />
    </Flex>
  );
};

type PercentDiffTagProps = {
  value: number;
  baseValue: number;
  invert?: boolean;
};
const PercentDiffTag = ({ invert, value, baseValue }: PercentDiffTagProps) => {
  const diff = value - baseValue;

  if (Math.abs(diff) < 0.05) {
    return null;
  }

  return (
    <Tag colorScheme={(invert ? diff > 0 : diff < 0) ? "red" : "green"} size={"sm"}>
      <TagLeftIcon as={diff < 0 ? TriangleDownIcon : TriangleUpIcon} />
      <TagLabel>{toPercent(Math.abs(diff))}</TagLabel>
    </Tag>
  );
};
