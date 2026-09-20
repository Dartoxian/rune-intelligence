import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { Box, Text } from "@chakra-ui/react";
import { useDeck } from "../DeckProvider";
import { toPercent } from "./utils";

const RED = "#d10f0f";
const GREY = "#878787";
const GOLD = "#d1ba0f";

export const DestinyOutcomeChart = () => {
  const { destinyData } = useDeck();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={destinyData.filter((d) => d.influenceSpent <= 7)}
        stackOffset="expand"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="influenceSpent" />
        <YAxis tickFormatter={toPercent} />
        <Tooltip content={renderTooltipContent} />
        <Area name="Red" type="monotone" dataKey="redBest" stackId="1" stroke={RED} fill={RED} />
        <Area name="Grey" type="monotone" dataKey="greyBest" stackId="1" stroke={GREY} fill={GREY} />
        <Area name="Gold" type="monotone" dataKey="goldBest" stackId="1" stroke={GOLD} fill={GOLD} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const getPercent = (value: number, total: number) => toPercent(total > 0 ? value / total : 0);

const renderTooltipContent = (props: TooltipProps<number, string>) => {
  const entries = props.payload ?? [];
  // recharts types `label` as `any`; narrow it rather than trusting it.
  const rawLabel: unknown = props.label;
  const influenceSpent = typeof rawLabel === "number" ? rawLabel : undefined;
  const total = entries.reduce((result, entry) => result + (entry.value ?? 0), 0);

  return (
    <Box bg={"gray.800"} borderColor={"gray.600"} borderWidth={"1px"} borderRadius={"5px"} px={"12px"} py={"8px"}>
      <Text fontWeight={"bold"} mb={"2px"}>
        {influenceSpent === undefined ? "Best destiny" : `${influenceSpent} influence spent`}
      </Text>
      <Box as={"ul"} listStyleType={"none"}>
        {entries.map((entry) => (
          <Text as={"li"} key={entry.name} color={entry.color}>
            {`${entry.name}: ${getPercent(entry.value ?? 0, total)}`}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
