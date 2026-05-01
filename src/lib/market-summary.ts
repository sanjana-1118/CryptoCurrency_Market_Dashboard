import type { Coin } from "@/services/coingecko";

export function buildMarketSummary(coins: Coin[], fng?: number | null): string {
  if (!coins.length) return "Awaiting market data…";
  const gainers = coins.filter((c) => c.price_change_percentage_24h > 0).length;
  const losers = coins.length - gainers;
  const avg =
    coins.reduce((s, c) => s + (c.price_change_percentage_24h || 0), 0) / coins.length;
  const top = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  )[0];

  let tone = "mixed";
  if (avg >= 2) tone = "strongly bullish";
  else if (avg >= 0.5) tone = "bullish";
  else if (avg <= -2) tone = "strongly bearish";
  else if (avg <= -0.5) tone = "bearish";

  const fngLabel =
    fng == null
      ? ""
      : fng >= 75
      ? " amid extreme greed"
      : fng >= 55
      ? " amid greed"
      : fng >= 45
      ? " with neutral sentiment"
      : fng >= 25
      ? " amid fear"
      : " amid extreme fear";

  return `Market shows ${tone} sentiment${fngLabel} — ${gainers} gainers vs ${losers} losers, led by ${top.name} (${top.price_change_percentage_24h >= 0 ? "+" : ""}${top.price_change_percentage_24h.toFixed(2)}%).`;
}