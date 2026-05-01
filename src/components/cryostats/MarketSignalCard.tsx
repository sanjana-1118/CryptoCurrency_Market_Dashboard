import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Coin } from "@/services/coingecko";

interface MarketSignalCardProps {
  coins: Coin[];
}

export function MarketSignalCard({ coins }: MarketSignalCardProps) {
  if (coins.length === 0) return null;

  const gainers = coins.filter((c) => c.price_change_percentage_24h > 0).length;
  const losers = coins.length - gainers;
  const avg =
    coins.reduce((s, c) => s + (c.price_change_percentage_24h || 0), 0) / coins.length;
  const ratio = gainers / coins.length;

  let signal: "Bullish" | "Bearish" | "Neutral" = "Neutral";
  if (avg >= 0.5 && ratio >= 0.55) signal = "Bullish";
  else if (avg <= -0.5 && ratio <= 0.45) signal = "Bearish";

  const tone =
    signal === "Bullish"
      ? "text-success bg-success/10 border-success/30"
      : signal === "Bearish"
      ? "text-loss bg-loss/10 border-loss/30"
      : "text-primary bg-primary/10 border-primary/30";

  const Icon = signal === "Bullish" ? TrendingUp : signal === "Bearish" ? TrendingDown : Minus;

  return (
    <Card className="p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Market Signal
        </span>
        <div
          className={`h-8 w-8 rounded-md flex items-center justify-center border ${tone}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold ${
            signal === "Bullish"
              ? "text-success"
              : signal === "Bearish"
              ? "text-loss"
              : "text-primary"
          }`}
        >
          {signal}
        </span>
        <span className="text-xs text-muted-foreground font-mono-num">
          avg {avg >= 0 ? "+" : ""}
          {avg.toFixed(2)}%
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1 text-[11px] font-mono-num">
        <div className="flex-1 flex h-1.5 rounded-full overflow-hidden bg-muted">
          <div
            className="bg-success transition-all duration-500"
            style={{ width: `${ratio * 100}%` }}
          />
          <div
            className="bg-loss transition-all duration-500"
            style={{ width: `${(1 - ratio) * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground font-mono-num">
        <span className="text-success">{gainers} up</span>
        <span className="text-loss">{losers} down</span>
      </div>
    </Card>
  );
}