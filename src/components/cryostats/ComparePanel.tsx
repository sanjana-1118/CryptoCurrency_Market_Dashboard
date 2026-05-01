import { X, GitCompare } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Coin } from "@/services/coingecko";
import { fmtCompact, fmtPct, fmtUsd } from "@/lib/format";

interface ComparePanelProps {
  coins: Coin[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

export function ComparePanel({ coins, onClear, onRemove }: ComparePanelProps) {
  if (coins.length === 0) return null;

  const [a, b] = coins;

  const winner = (key: "current_price" | "price_change_percentage_24h" | "market_cap") => {
    if (!a || !b) return null;
    if (a[key] === b[key]) return null;
    return a[key] > b[key] ? a.id : b.id;
  };

  const priceWin = winner("current_price");
  const pctWin = winner("price_change_percentage_24h");
  const mcWin = winner("market_cap");

  const Cell = ({
    coin,
    isWinner,
    children,
  }: {
    coin: Coin;
    isWinner: boolean;
    children: React.ReactNode;
  }) => (
    <div
      className={`flex-1 px-3 py-2 rounded-md font-mono-num text-sm transition-colors ${
        isWinner ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
      }`}
      data-coin={coin.id}
    >
      {children}
    </div>
  );

  const Row = ({
    label,
    render,
    winId,
  }: {
    label: string;
    render: (c: Coin) => React.ReactNode;
    winId: string | null;
  }) => (
    <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] items-center gap-3 py-1">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex flex-col sm:flex-row gap-2">
        {coins.map((c) => (
          <Cell key={c.id} coin={c} isWinner={winId === c.id}>
            {render(c)}
          </Cell>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-4 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <GitCompare className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Compare Mode</h3>
            <p className="text-[11px] text-muted-foreground">
              {coins.length === 1 ? "Pick one more asset to compare" : "Better value highlighted"}
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] items-center gap-3 py-2 border-b border-border mb-2">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Asset</div>
        <div className="flex flex-col sm:flex-row gap-2">
          {coins.map((c) => (
            <div
              key={c.id}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md bg-card/60 border border-border"
            >
              <img src={c.image} alt={c.name} className="h-7 w-7 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{c.name}</div>
                <div className="text-[10px] uppercase text-muted-foreground">{c.symbol}</div>
              </div>
              <button
                onClick={() => onRemove(c.id)}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Remove ${c.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {coins.length === 1 && (
            <div className="flex-1 px-3 py-2 rounded-md border border-dashed border-border text-xs text-muted-foreground flex items-center justify-center">
              Tap the compare icon on any row
            </div>
          )}
        </div>
      </div>

      <Row label="Price" render={(c) => fmtUsd(c.current_price)} winId={priceWin} />
      <Row
        label="24h Change"
        winId={pctWin}
        render={(c) => (
          <span className={c.price_change_percentage_24h >= 0 ? "text-success" : "text-loss"}>
            {fmtPct(c.price_change_percentage_24h)}
          </span>
        )}
      />
      <Row label="Market Cap" render={(c) => `$${fmtCompact(c.market_cap)}`} winId={mcWin} />
      <Row label="24h Volume" render={(c) => `$${fmtCompact(c.total_volume)}`} winId={null} />
    </Card>
  );
}