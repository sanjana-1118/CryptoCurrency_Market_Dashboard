import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Coin } from "@/services/coingecko";
import { CoinRow } from "./CoinRow";
import { Pagination } from "./Pagination";
import { FilterBar, type FilterKey } from "./FilterBar";
import { CoinRowSkeleton } from "./CoinRowSkeleton";

type SortKey = "market_cap" | "current_price" | "price_change_percentage_24h";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

interface MarketTableProps {
  coins: Coin[];
  loading: boolean;
  onSelect: (coin: Coin) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  prevPrices?: Record<string, number>;
}

export function MarketTable({
  coins,
  loading,
  onSelect,
  favorites,
  onToggleFavorite,
  compareIds,
  onToggleCompare,
  prevPrices,
}: MarketTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = coins;
    if (filter === "favorites") {
      list = list.filter((c) => favorites.includes(c.id));
    } else if (filter === "gainers") {
      list = list.filter((c) => (c.price_change_percentage_24h ?? 0) > 0);
    } else if (filter === "losers") {
      list = list.filter((c) => (c.price_change_percentage_24h ?? 0) < 0);
    } else if (filter === "high-cap") {
      list = [...list]
        .sort((a, b) => b.market_cap - a.market_cap)
        .slice(0, Math.max(10, Math.ceil(coins.length * 0.2)));
    }
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
      );
    }
    const sorted = [...list].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    // Pin favorites to top (except when filtering favorites only)
    if (filter !== "favorites" && favorites.length > 0) {
      const favSet = new Set(favorites);
      const favs = sorted.filter((c) => favSet.has(c.id));
      const rest = sorted.filter((c) => !favSet.has(c.id));
      return [...favs, ...rest];
    }
    return sorted;
  }, [coins, query, sortKey, sortDir, filter, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const SortHeader = ({
    label,
    k,
    align = "right",
    className = "",
  }: {
    label: string;
    k: SortKey;
    align?: "left" | "right";
    className?: string;
  }) => {
    const active = sortKey === k;
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${
          active ? "text-foreground" : "text-muted-foreground"
        } ${align === "right" ? "ml-auto" : ""} ${className}`}
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </button>
    );
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border">
        <div>
          <h2 className="text-base font-semibold">Market Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Top 50 by market capitalization</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search name or symbol…"
              className="pl-9 h-9"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <FilterBar
          active={filter}
          onChange={(k) => {
            setFilter(k);
            setPage(1);
          }}
          favoritesCount={favorites.length}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="py-3 pl-4 pr-1 w-10" />
              <th className="py-3 px-1 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-10">
                #
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Asset
              </th>
              <th className="py-3 px-2 text-right text-xs font-medium uppercase tracking-wider">
                <SortHeader label="Price" k="current_price" />
              </th>
              <th className="py-3 px-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                1h %
              </th>
              <th className="py-3 px-2 text-right text-xs font-medium uppercase tracking-wider">
                <SortHeader label="24h %" k="price_change_percentage_24h" />
              </th>
              <th className="py-3 px-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                7d %
              </th>
              <th className="py-3 px-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                Last 7d
              </th>
              <th className="py-3 pl-2 pr-4 text-right text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                <SortHeader label="Market Cap" k="market_cap" />
              </th>
              <th className="py-3 pl-1 pr-4 w-10" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) =>  (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 pl-4 pr-1"><Skeleton className="h-4 w-4" /></td>
                    <td className="py-4 px-1"><Skeleton className="h-4 w-6" /></td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-24" />
                          <Skeleton className="h-2.5 w-12" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    <td className="py-4 px-2 hidden md:table-cell"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    <td className="py-4 px-2"><Skeleton className="h-4 w-14 ml-auto" /></td>
                    <td className="py-4 px-2 hidden md:table-cell"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    <td className="py-4 px-2 hidden lg:table-cell"><Skeleton className="h-9 w-[110px] ml-auto" /></td>
                    <td className="py-4 pl-2 pr-4 hidden sm:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="py-4 pl-1 pr-4"><Skeleton className="h-4 w-4" /></td>
                  </tr>
                ))
              : paged.length > 0
              ? paged.map((coin) => (
                  <CoinRow
                    key={coin.id}
                    coin={coin}
                    onSelect={onSelect}
                    isFavorite={favorites.includes(coin.id)}
                    onToggleFavorite={onToggleFavorite}
                    isCompared={compareIds.includes(coin.id)}
                    onToggleCompare={onToggleCompare}
                    prevPrice={prevPrices?.[coin.id]}
                  />
                ))
              : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                    {filter === "favorites" && favorites.length === 0
                      ? "No favorites yet — tap a star to save coins."
                      : query
                      ? `No coins match "${query}"`
                      : "No coins match the current filter."}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onChange={setPage}
          total={filtered.length}
          pageSize={PAGE_SIZE}
        />
      )}
    </Card>
  );
}
