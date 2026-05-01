import { Activity, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { LiveUpdated } from "./LiveUpdated";

interface HeaderProps {
  lastUpdated: Date | null;
}

export function Header({ lastUpdated }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">CoinPrism</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground -mt-0.5 hidden sm:block">
              Real-time Crypto Market Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LiveUpdated lastUpdated={lastUpdated} />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
