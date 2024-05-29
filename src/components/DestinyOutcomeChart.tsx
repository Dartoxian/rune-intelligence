import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import * as React from "react";
import { useDeck } from "../DeckProvider";
import { useMemo } from "react";
import { FateDestiny } from "../data/cards";

const toPercent = (decimal: number, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

export const DestinyOutcomeChart = () => {
  const { cards } = useDeck();
  const unseenCards = useMemo(() => cards.filter((c) => !c.drawn), [cards]);
  const data = useMemo(() => {
    const redCards = unseenCards.filter((card) => card.card.destiny === "red").length;
    const greyCards = unseenCards.filter((card) => card.card.destiny === "grey").length;
    const goldCards = unseenCards.filter((card) => card.card.destiny === "gold").length;

    // Consider spending up to 7 influence to find the best destiny
    const ithOutcomes = [{ influenceSpent: 0, redBest: 1, greyBest: 0, goldBest: 0 }];
    for (let i = 1; i <= 7; i += 1) {
      ithOutcomes.push({
        influenceSpent: i,
        // Every card so far is red and the next card is red
        redBest: (ithOutcomes[i - 1].redBest * (redCards - i + 1)) / (unseenCards.length - i + 1),
        // Either gray is already the best and the next card is not gold, or red is the best and the next card is gray
        greyBest:
          (ithOutcomes[i - 1].greyBest * (unseenCards.length - i + 1 - goldCards)) / (unseenCards.length - i + 1) +
          (ithOutcomes[i - 1].redBest * greyCards) / (unseenCards.length - i + 1),
        // Either gold is already the best, or red or gray is the best and the next card is gold
        goldBest:
          ithOutcomes[i - 1].goldBest +
          ((ithOutcomes[i - 1].redBest + ithOutcomes[i - 1].greyBest) * goldCards) / (unseenCards.length - i + 1),
      });
    }

    return ithOutcomes;
  }, [unseenCards]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
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

  return toPercent(ratio, 2);
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
