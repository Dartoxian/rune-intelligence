import deckJson from "./cards.json";

export type FateValueType = "damage" | "special" | "route";
export type FateValue = null | { type: FateValueType; count: number };
export type FateDestiny = "gold" | "red" | "grey";

export type FateCard = {
  id: number;
  triangle: FateValue;
  rectangle: FateValue;
  hexagon: FateValue;
  circle: FateValue;
  destiny: FateDestiny;
};

export type FateDeck = {
  version: number;
  cards: FateCard[];
};

export default deckJson as FateDeck;
