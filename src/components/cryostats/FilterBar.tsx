import { Flame, Layers, Snowflake, Sparkles, Star } from "lucide-react";

export type FilterKey = "all" | "favorites" | "gainers" | "losers" | "high-cap";

interface FilterBarProps {
  active: FilterKey;
  onChange: (k: FilterKey) => void;
  favoritesCount: number;
}

const FILTERS: { key: FilterKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "favorites", label: "Favorites", icon: Star },
  { key: "gainers", label: "Top Gainers", icon: Flame },
  { key: "losers", label: "Top Losers", icon: Snowflake },
  { key: "high-cap", label: "High Cap", icon: Layers },
];

export function FilterBar({ active, onChange, favoritesCount }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`group inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border transition-all duration-150 ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
            aria-pressed={isActive}
          >
            <Icon
              className={`h-3.5 w-3.5 ${
                isActive ? "" : key === "favorites" ? "" : ""
              }`}
            />
            <span>{label}</span>
            {key === "favorites" && favoritesCount > 0 && (
              <span
                className={`font-mono-num text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-primary-foreground/20" : "bg-muted"
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}