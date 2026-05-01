import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOhlc, type Coin, type Ohlc } from "@/services/coingecko";
import { fmtUsd } from "@/lib/format";

interface CandlestickChartProps {
  coin: Coin;
}

export function CandlestickChart({ coin }: CandlestickChartProps) {
  const [data, setData] = useState<Ohlc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOhlc(coin.id, 7)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load chart");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [coin.id]);

  if (loading) return <Skeleton className="h-[260px] w-full" />;
  if (error)
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  if (!data.length)
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
        No chart data
      </div>
    );

  const W = 800;
  const H = 260;
  const padL = 56;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const highs = data.map((d) => d.h);
  const lows = data.map((d) => d.l);
  const yMax = Math.max(...highs);
  const yMin = Math.min(...lows);
  const yRange = yMax - yMin || 1;

  const slot = innerW / data.length;
  const candleW = Math.max(2, slot * 0.6);

  const yScale = (v: number) => padT + (1 - (v - yMin) / yRange) * innerH;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yMin + (yRange * i) / ticks);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="h-5 w-5 rounded-full" />
          <span className="text-sm font-semibold">{coin.name}</span>
          <span className="text-xs uppercase text-muted-foreground">{coin.symbol}</span>
        </div>
        <span className="text-xs text-muted-foreground">7-day OHLC · 4h candles</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-[260px]"
        role="img"
        aria-label={`${coin.name} 7 day candlestick chart`}
      >
        {yTicks.map((t, i) => {
          const y = yScale(t);
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="2 4"
              />
              <text
                x={padL - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground"
                style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              >
                {fmtUsd(t)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = padL + slot * i + slot / 2;
          const yH = yScale(d.h);
          const yL = yScale(d.l);
          const yO = yScale(d.o);
          const yC = yScale(d.c);
          const up = d.c >= d.o;
          const top = Math.min(yO, yC);
          const height = Math.max(1, Math.abs(yC - yO));
          const colorClass = up ? "fill-success stroke-success" : "fill-loss stroke-loss";
          return (
            <g key={d.t} className={colorClass}>
              <line x1={x} x2={x} y1={yH} y2={yL} strokeWidth={1} />
              <rect
                x={x - candleW / 2}
                y={top}
                width={candleW}
                height={height}
                rx={1}
              />
            </g>
          );
        })}
        <line
          x1={padL}
          x2={W - padR}
          y1={H - padB}
          y2={H - padB}
          stroke="currentColor"
          className="text-border"
        />
      </svg>
    </div>
  );
}