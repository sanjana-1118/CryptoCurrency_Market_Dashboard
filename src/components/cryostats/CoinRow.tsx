import { Star, GitCompare } from "lucide-react";
import { memo } from "react";
import type { Coin } from "@/services/coingecko";
import { fmtCompact, fmtPct, fmtUsd } from "@/lib/format";
import { Sparkline } from "./Sparkline";

interface CoinRowProps {
  coin: Coin;
  onSelect: (coin: Coin) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  prevPrice?: number;
}

function PctCell({ value }: { value: number | null | undefined }) {
  if (value == null || Number.isNaN(value)) {
    return <span className="text-muted-foreground">—</span>;
  }
  const positive = value >= 0;
  return (
    <span className={positive ? "text-success" : "text-loss"}>{fmtPct(value)}</span>
  );
}

function CoinRowImpl({
  coin,
  onSelect,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  prevPrice,
}: CoinRowProps) {
  const pct1h = coin.price_change_percentage_1h_in_currency ?? null;
  const pct24h = coin.price_change_percentage_24h ?? null;
  const pct7d = coin.price_change_percentage_7d_in_currency ?? null;
  const spark = coin.sparkline_in_7d?.price ?? [];

  let flashClass = "";
  if (prevPrice != null && prevPrice !== coin.current_price) {
    flashClass = coin.current_price > prevPrice ? "flash-up" : "flash-down";
  }
  // key on price to retrigger animation
  const flashKey = `${coin.current_price}`;

  return (
    <tr
      onClick={() => onSelect(coin)}
      className={`border-b border-border last:border-0 hover:bg-accent/40 cursor-pointer transition-colors duration-150 ${
        isCompared ? "bg-primary/5" : ""
      }`}
    >
      <td className="py-4 pl-4 pr-1 w-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(coin.id);
          }}
          className="p-1 rounded-md hover:bg-accent transition-all duration-150 hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          />
        </button>
      </td>
      <td className="py-4 px-1 text-sm text-muted-foreground font-mono-num w-10">
        {coin.market_cap_rank}
      </td>
      <td className="py-4 px-2">
        <div className="flex items-center gap-3 min-w-0">
          <img src={coin.image} alt={coin.name} className="h-7 w-7 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate">{coin.name}</div>
            <div className="text-xs uppercase text-muted-foreground">{coin.symbol}</div>
          </div>
        </div>
      </td>
      <td key={flashKey} className={`py-4 px-2 text-right font-mono-num font-medium ${flashClass}`}>
        {fmtUsd(coin.current_price)}
      </td>
      <td className="py-4 px-2 text-right font-mono-num font-semibold hidden md:table-cell">
        <PctCell value={pct1h} />
      </td>
      <td className="py-4 px-2 text-right font-mono-num font-semibold">
        <PctCell value={pct24h} />
      </td>
      <td className="py-4 px-2 text-right font-mono-num font-semibold hidden md:table-cell">
        <PctCell value={pct7d} />
      </td>
      <td className="py-4 px-2 hidden lg:table-cell">
        <div className="flex justify-end">
          <Sparkline data={spark} positive={(pct7d ?? 0) >= 0} />
        </div>
      </td>
      <td className="py-4 pl-2 pr-4 text-right font-mono-num text-muted-foreground hidden sm:table-cell">
        ${fmtCompact(coin.market_cap)}
      </td>
      <td className="py-4 pl-1 pr-4 w-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(coin.id);
          }}
          className={`p-1 rounded-md transition-all duration-150 hover:scale-110 ${
            isCompared
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
          aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
          aria-pressed={isCompared}
        >
          <GitCompare className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export const CoinRow = memo(CoinRowImpl);
