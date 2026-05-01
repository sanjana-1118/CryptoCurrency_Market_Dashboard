import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Coin } from "@/services/coingecko";
import { CandlestickChart } from "./CandlestickChart";
import { MarketTreemap } from "./MarketTreemap";

interface MarketVisualsProps {
  coins: Coin[];
  loading: boolean;
  selectedCoin: Coin | null;
}

export function MarketVisuals({ coins, loading, selectedCoin }: MarketVisualsProps) {
  const coin = selectedCoin ?? coins.find((c) => c.id === "bitcoin") ?? coins[0] ?? null;

  return (
    <Card className="p-4">
      <Tabs defaultValue="candlestick" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold">Market Visuals</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any asset in the table to chart it
            </p>
          </div>
          <TabsList className="self-start sm:self-auto">
            <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="candlestick" className="mt-0">
          {loading || !coin ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <CandlestickChart coin={coin} />
          )}
        </TabsContent>
        <TabsContent value="heatmap" className="mt-0">
          <MarketTreemap coins={coins} loading={loading} embedded />
        </TabsContent>
      </Tabs>
    </Card>
  );
}