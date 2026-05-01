import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Coin } from "@/services/coingecko";
import { fmtPct } from "@/lib/format";

interface MarketTreemapProps {
  coins: Coin[];
  loading: boolean;
  embedded?: boolean;
}

/**
 * Lightweight treemap using a row-based squarified layout.
 * Top 12 coins by market cap, sized by share, colored by 24h change.
 */
export function MarketTreemap({ coins, loading, embedded = false }: MarketTreemapProps) {
  if (loading) {
    if (embedded) return <Skeleton className="h-56 w-full" />;
    return (
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Market Heatmap</h3>
        <Skeleton className="h-56 w-full" />
      </Card>
    );
  }

  const top = [...coins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 12);
  const total = top.reduce((s, c) => s + c.market_cap, 0);

  // Two rows: 4 large + 8 small
  const big = top.slice(0, 4);
  const small = top.slice(4);
  const bigTotal = big.reduce((s, c) => s + c.market_cap, 0);
  const smallTotal = small.reduce((s, c) => s + c.market_cap, 0);

  const cellColor = (pct: number) => {
    if (pct >= 3) return "bg-success/80 text-success-foreground";
    if (pct >= 0) return "bg-success/40 text-foreground";
    if (pct > -3) return "bg-loss/40 text-foreground";
    return "bg-loss/80 text-loss-foreground";
  };

  const inner = (
    <>
      {!embedded && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Market Heatmap</h3>
          <span className="text-[11px] text-muted-foreground">Top 12 · sized by market cap</span>
        </div>
      )}
      <div className="flex flex-col gap-1 h-56">
        <div className="flex gap-1 h-3/5">
          {big.map((c) => (
            <div
              key={c.id}
              style={{ flex: c.market_cap / bigTotal }}
              className={`rounded-md p-2 flex flex-col justify-between overflow-hidden transition-transform hover:scale-[1.02] ${cellColor(c.price_change_percentage_24h)}`}
              title={`${c.name} ${fmtPct(c.price_change_percentage_24h)}`}
            >
              <div className="text-xs font-bold uppercase truncate">{c.symbol}</div>
              <div className="text-[11px] font-mono-num font-semibold">
                {fmtPct(c.price_change_percentage_24h)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1 h-2/5">
          {small.map((c) => (
            <div
              key={c.id}
              style={{ flex: c.market_cap / smallTotal }}
              className={`rounded-md p-1.5 flex flex-col justify-between overflow-hidden transition-transform hover:scale-[1.02] ${cellColor(c.price_change_percentage_24h)}`}
              title={`${c.name} ${fmtPct(c.price_change_percentage_24h)}`}
            >
              <div className="text-[10px] font-bold uppercase truncate">{c.symbol}</div>
              <div className="text-[10px] font-mono-num font-semibold">
                {fmtPct(c.price_change_percentage_24h)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground">
        Total market cap of top 12: ${(total / 1e12).toFixed(2)}T
      </div>
    </>
  );

  if (embedded) return <div>{inner}</div>;
  return <Card className="p-4">{inner}</Card>;
}
