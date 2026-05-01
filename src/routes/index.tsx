import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Header } from "@/components/cryostats/Header";
import { Insights } from "@/components/cryostats/Insights";
import { MarketTable } from "@/components/cryostats/MarketTable";
import { CoinModal } from "@/components/cryostats/CoinModal";
import { MarketStats } from "@/components/cryostats/MarketStats";
import { MarketVisuals } from "@/components/cryostats/MarketVisuals";
import { ComparePanel } from "@/components/cryostats/ComparePanel";
import { Hero } from "@/components/cryostats/Hero";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  fetchTopCoins,
  fetchFearGreed,
  type Coin,
  type FearGreed,
} from "@/services/coingecko";

import { useFavorites } from "@/hooks/use-favorites";
import { useCompare } from "@/hooks/use-compare";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------------- SKELETON COMPONENTS ---------------- */

const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-xl ${className}`} />
);

const HeroSkeleton = () => (
  <div className="space-y-3">
    <SkeletonCard className="h-10 w-2/3" />
    <SkeletonCard className="h-5 w-1/2" />
  </div>
);

const InsightsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonCard key={i} className="h-24" />
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} className="h-12 w-full" />
    ))}
  </div>
);

const StatsSkeleton = () => (
  <div className="space-y-3">
    <SkeletonCard className="h-24 w-full" />
    <SkeletonCard className="h-24 w-full" />
  </div>
);

const VisualsSkeleton = () => (
  <SkeletonCard className="h-64 w-full" />
);

/* ---------------- MAIN COMPONENT ---------------- */

function Index() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Coin | null>(null);
  const [chartCoin, setChartCoin] = useState<Coin | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreed | null>(null);
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});

  const pricesRef = useRef<Record<string, number>>({});
  const { favorites, toggle } = useFavorites();
  const { ids: compareIds, toggle: toggleCompare, clear: clearCompare } =
    useCompare(2);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const data = await fetchTopCoins(50);

      setPrevPrices({ ...pricesRef.current });

      const next: Record<string, number> = {};
      for (const c of data) next[c.id] = c.current_price;
      pricesRef.current = next;

      setCoins(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFng = useCallback(async () => {
    try {
      const fng = await fetchFearGreed();
      setFearGreed(fng);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    load();
    loadFng();

    const id = setInterval(() => {
      load(true);
      loadFng();
    }, 30_000);

    return () => clearInterval(id);
  }, [load, loadFng]);

  const handleSelect = useCallback((coin: Coin) => {
    setSelected(coin);
    setChartCoin(coin);
  }, []);

  const compareCoins = useMemo(
    () =>
      compareIds
        .map((id) => coins.find((c) => c.id === id))
        .filter((c): c is Coin => Boolean(c)),
    [compareIds, coins]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header lastUpdated={lastUpdated} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error && (
    <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive flex items-center justify-between">
      <span>
        ⚠️ Live data refresh failed. Showing last available data.
      </span>

      <Button
        size="sm"
        variant="outline"
        onClick={() => load()}
        className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  )}
          <>
            {/* HERO */}
            {loading ? <HeroSkeleton /> : <Hero />}

            {/* INSIGHTS */}
            {loading ? (
              <InsightsSkeleton />
            ) : (
              <Insights coins={coins} fearGreed={fearGreed} loading={false} />
            )}

            {/* COMPARE PANEL */}
            {compareCoins.length > 0 && (
              <ComparePanel
                coins={compareCoins}
                onClear={clearCompare}
                onRemove={toggleCompare}
              />
            )}

            {/* TABLE + STATS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <MarketTable
                    coins={coins}
                    loading={false}
                    onSelect={handleSelect}
                    favorites={favorites}
                    onToggleFavorite={toggle}
                    compareIds={compareIds}
                    onToggleCompare={toggleCompare}
                    prevPrices={prevPrices}
                  />
                )}
              </div>

              <div className="space-y-6">
                {loading ? (
                  <StatsSkeleton />
                ) : (
                  <MarketStats coins={coins} loading={false} />
                )}
              </div>
            </div>

            {/* VISUALS */}
            {loading ? (
              <VisualsSkeleton />
            ) : (
              <MarketVisuals
                coins={coins}
                loading={false}
                selectedCoin={chartCoin}
              />
            )}

            {/* FOOTER */}
            <footer className="text-center text-xs text-muted-foreground/80 pt-6 pb-4 max-w-2xl mx-auto leading-relaxed">
              Live data powered by CoinGecko. This dashboard is for educational
              and informational purposes only and does not constitute financial
              advice.
              <div className="mt-1 text-[11px] text-muted-foreground/60">
                Auto-refreshes every 30 seconds.
              </div>
            </footer>
          </>
        {/*)}*/}
      </main>

      <CoinModal coin={selected} onClose={() => setSelected(null)} />
    </div>
  );
}