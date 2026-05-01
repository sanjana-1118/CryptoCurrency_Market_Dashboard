import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Coin } from "@/services/coingecko";
import { fmtCompact } from "@/lib/format";

export function MarketStats({ coins, loading }: { coins: Coin[]; loading: boolean }) {
  if (loading) {
    return (
      <Card className="p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }
  const totalMc = coins.reduce((s, c) => s + c.market_cap, 0);
  const totalVol = coins.reduce((s, c) => s + c.total_volume, 0);
  const gainers = coins.filter((c) => c.price_change_percentage_24h > 0).length;
  const losers = coins.length - gainers;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Market Snapshot</h3>
      <div className="space-y-3">
        <div className="rounded-lg bg-muted/40 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Total Market Cap
          </div>
          <div className="font-mono-num font-bold text-lg mt-0.5">${fmtCompact(totalMc)}</div>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            24h Volume
          </div>
          <div className="font-mono-num font-bold text-lg mt-0.5">${fmtCompact(totalVol)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-success/10 p-3 text-center">
            <div className="text-[11px] uppercase tracking-wider text-success">Gainers</div>
            <div className="font-mono-num font-bold text-lg text-success">{gainers}</div>
          </div>
          <div className="rounded-lg bg-loss/10 p-3 text-center">
            <div className="text-[11px] uppercase tracking-wider text-loss">Losers</div>
            <div className="font-mono-num font-bold text-lg text-loss">{losers}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
