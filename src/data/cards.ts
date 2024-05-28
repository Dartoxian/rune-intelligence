declare module "cards.json" {
    export type FateValueType = "damage" | "special" | "route";
    export type FateValue = null | { type: FateValueType, count: number }
    export type FateDestiny = "gold" | "red" | "grey"

    export type FateCard = {
        id: number;
        triangle: FateValue;
        rectangle: FateValue;
        hexagon: FateValue;
        circle: FateValue;
        destiny: FateDestiny
    }

    export default {
        version: string,
        cards: Array<FateCard>,
    }
}