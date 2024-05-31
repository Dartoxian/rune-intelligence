import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import * as React from "react";
import { useDeck } from "../DeckProvider";
import { useMemo } from "react";
import { FateDestiny } from "../data/cards";
import { toPercent } from "./utils";

export const DestinyOutcomeChart = () => {
  const { destinyData } = useDeck();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
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
        <Area type="monotone" dataKey="redBest" stackId="1" stroke="#d10f0f" fill="#d10f0f" />
        <Area type="monotone" dataKey="greyBest" stackId="1" stroke="#878787" fill="#878787" />
        <Area type="monotone" dataKey="goldBest" stackId="1" stroke="#d1ba0f" fill="#d1ba0f" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const getPercent = (value: number, total: number) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio);
};

const renderTooltipContent = (o: TooltipProps<number, FateDestiny>) => {
  const { payload, label } = o;
  const total = payload!.reduce((result, entry) => result + entry.value!, 0);

  return (
    <div className="customized-tooltip-content">
      <p className="total">{`${label} Influence`}</p>
      <ul className="list">
        {payload!.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${getPercent(entry.value!, total)}`}
          </li>
        ))}
      </ul>
    </div>
  );
};
