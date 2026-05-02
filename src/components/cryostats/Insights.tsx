import { TrendingUp, TrendingDown, Zap, Gauge, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Coin } from "@/services/coingecko";
import { fmtPct, fmtUsd } from "@/lib/format";
import { buildMarketSummary } from "@/lib/market-summary";
import { MarketSignalCard } from "./MarketSignalCard";

interface InsightsProps {
  coins: Coin[];
  loading: boolean;
  fearGreed: { value: number; classification: string } | null;
}

function InsightCard({
  label,
  icon,
  coin,
  pct,
  tone,
}: {
  label: string;
  icon: React.ReactNode;
  coin: Coin;
  pct: number;
  tone: "success" | "loss" | "primary";
}) {
  const toneClasses =
    tone === "success"
      ? "text-success bg-success/10"
      : tone === "loss"
      ? "text-loss bg-loss/10"
      : "text-primary bg-primary/10";

  return (
    <Card className="p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={`h-8 w-8 rounded-md flex items-center justify-center ${toneClasses}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="h-9 w-9 rounded-full" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{coin.name}</div>
          <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
        </div>
        <div className="text-right">
          <div className="font-mono-num font-semibold text-sm">{fmtUsd(coin.current_price)}</div>
          <div
            className={`text-xs font-mono-num font-semibold ${
              pct >= 0 ? "text-success" : "text-loss"
            }`}
          >
            {fmtPct(pct)}
          </div>
        </div>
      </div>
    </Card>
  );
}

function FearGreedCard({
  value,
  classification,
}: {
  value: number;
  classification: string;
}) {
  const tone =
    value >= 75
      ? "text-success bg-success/10"
      : value >= 55
      ? "text-success bg-success/10"
      : value >= 45
      ? "text-primary bg-primary/10"
      : value >= 25
      ? "text-loss bg-loss/10"
      : "text-loss bg-loss/10";
  const barColor =
    value >= 55 ? "bg-success" : value >= 45 ? "bg-primary" : "bg-loss";

  return (
    <Card className="p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Fear &amp; Greed
        </span>
        <div className={`h-8 w-8 rounded-md flex items-center justify-center ${tone}`}>
          <Gauge className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono-num">{value}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
      <div className="mt-1 text-sm font-medium">{classification}</div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </Card>
  );
}

export function Insights({ coins, loading, fearGreed }: InsightsProps) {
  if (loading || coins.length === 0) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </Card>
          ))}
        </div>
      </div>
    );
  }

  const sorted = [...coins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  );
  const topGainer = sorted[0];
  const topLoser = sorted[sorted.length - 1];
  const mostVolatile = [...coins].sort(
    (a, b) =>
      Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h),
  )[0];

  const summary = buildMarketSummary(coins, fearGreed?.value ?? null);

  return (
    <div className="space-y-3">
    <Card className="px-4 py-2.5 flex items-center gap-3 bg-gradient-to-r from-primary/5 via-card to-card border-primary/20">
        <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:block">
          AI Summary
        </div>
        <div className="text-sm text-foreground/90 leading-snug truncate">{summary}</div>
      </Card>
      {/*  <Card className="px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary/5 via-card to-card border-primary/20">
      <div className="flex items-center gap-2 flex-shrink-0">
      <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
      <Sparkles className="h-3.5 w-3.5" />
      </div>
      {/* Show label on mobile too, but keep it subtle */}
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
        AI Summary
      </div>
      </div>
        {/* Changed 'truncate' to allow wrapping. 'leading-relaxed' helps readability on small screens */}
        <div className="text-sm text-foreground/90 leading-relaxed sm:leading-snug">
          {summary}
        </div>
      </Card> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <InsightCard
        label="Top Gainer (24h)"
        icon={<TrendingUp className="h-4 w-4" />}
        coin={topGainer}
        pct={topGainer.price_change_percentage_24h}
        tone="success"
      />
      <InsightCard
        label="Top Loser (24h)"
        icon={<TrendingDown className="h-4 w-4" />}
        coin={topLoser}
        pct={topLoser.price_change_percentage_24h}
        tone="loss"
      />
      <InsightCard
        label="Most Volatile"
        icon={<Zap className="h-4 w-4" />}
        coin={mostVolatile}
        pct={mostVolatile.price_change_percentage_24h}
        tone="primary"
      />
      {fearGreed ? (
        <FearGreedCard value={fearGreed.value} classification={fearGreed.classification} />
      ) : (
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Fear &amp; Greed
            </span>
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-muted text-muted-foreground">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Unavailable</div>
        </Card>
      )}
      <MarketSignalCard coins={coins} />
      </div>
    </div>
  );
}
