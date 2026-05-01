import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Coin } from "@/services/coingecko";
import { fmtCompact, fmtNumber, fmtPct, fmtUsd } from "@/lib/format";

interface CoinModalProps {
  coin: Coin | null;
  onClose: () => void;
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "loss" }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-mono-num font-semibold text-sm ${
          tone === "success" ? "text-success" : tone === "loss" ? "text-loss" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function CoinModal({ coin, onClose }: CoinModalProps) {
  const open = !!coin;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        {coin && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="h-10 w-10 rounded-full" />
                <div className="text-left">
                  <div className="text-lg font-semibold">{coin.name}</div>
                  <div className="text-xs uppercase font-normal text-muted-foreground">
                    {coin.symbol} · Rank #{coin.market_cap_rank}
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono-num">{fmtUsd(coin.current_price)}</span>
              <span
                className={`font-mono-num font-semibold ${
                  coin.price_change_percentage_24h >= 0 ? "text-success" : "text-loss"
                }`}
              >
                {fmtPct(coin.price_change_percentage_24h)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="24h High" value={fmtUsd(coin.high_24h)} tone="success" />
              <Stat label="24h Low" value={fmtUsd(coin.low_24h)} tone="loss" />
              <Stat label="Market Cap" value={`$${fmtCompact(coin.market_cap)}`} />
              <Stat label="24h Volume" value={`$${fmtCompact(coin.total_volume)}`} />
              <Stat
                label="Circulating Supply"
                value={`${fmtNumber(coin.circulating_supply)} ${coin.symbol.toUpperCase()}`}
              />
              <Stat
                label="Max Supply"
                value={coin.max_supply ? fmtNumber(coin.max_supply) : "∞"}
              />
              <Stat label="All-Time High" value={fmtUsd(coin.ath)} />
              <Stat label="All-Time Low" value={fmtUsd(coin.atl)} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
