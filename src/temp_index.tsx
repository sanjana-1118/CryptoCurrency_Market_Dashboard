/*
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
import { fetchTopCoins, fetchFearGreed, type Coin, type FearGreed } from "@/services/coingecko";
import { useFavorites } from "@/hooks/use-favorites";
import { useCompare } from "@/hooks/use-compare";

export const Route = createFileRoute("/")({
  component: Index,
});

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
  const { ids: compareIds, toggle: toggleCompare, clear: clearCompare } = useCompare(2);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchTopCoins(50);
      // capture previous price snapshot for flash highlights
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
    [compareIds, coins],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header lastUpdated={lastUpdated} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error ? (
          <Card className="p-8 flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Couldn't load market data</h2>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button onClick={() => load()} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </Card>
        ) : (
          <>
            <Hero />
            <Insights coins={coins} loading={loading} fearGreed={fearGreed} />

            {compareCoins.length > 0 && (
              <ComparePanel
                coins={compareCoins}
                onClear={clearCompare}
                onRemove={toggleCompare}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MarketTable
                  coins={coins}
                  loading={loading}
                  onSelect={handleSelect}
                  favorites={favorites}
                  onToggleFavorite={toggle}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                  prevPrices={prevPrices}
                />
              </div>
              <div className="space-y-6">
                <MarketStats coins={coins} loading={loading} />
              </div>
            </div>

            <MarketVisuals coins={coins} loading={loading} selectedCoin={chartCoin} />

            <footer className="text-center text-xs text-muted-foreground/80 pt-6 pb-4 max-w-2xl mx-auto leading-relaxed">
              Live data powered by CoinGecko. This dashboard is for educational and informational
              purposes only and does not constitute financial advice.
              <div className="mt-1 text-[11px] text-muted-foreground/60">
                Auto-refreshes every 30 seconds.
              </div>
            </footer>
          </>
        )}
      </main>

      <CoinModal coin={selected} onClose={() => setSelected(null)} />
    </div>
  );
  
}
*/