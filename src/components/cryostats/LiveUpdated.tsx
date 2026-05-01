import { useElapsed } from "@/hooks/use-elapsed";

interface LiveUpdatedProps {
  lastUpdated: Date | null;
  intervalMs?: number;
}

function formatElapsed(s: number) {
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

export function LiveUpdated({ lastUpdated, intervalMs = 30_000 }: LiveUpdatedProps) {
  const elapsed = useElapsed(lastUpdated);

  if (!lastUpdated || elapsed == null) return null;

  const fresh = elapsed < 3;
  const intervalSec = Math.floor(intervalMs / 1000);
  const progress = Math.min(1, elapsed / intervalSec);

  return (
    <div
      className={`hidden md:flex items-center gap-2 text-xs text-muted-foreground transition-opacity duration-300 ${
        fresh ? "opacity-100" : "opacity-90"
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-success ${
            fresh ? "animate-ping opacity-75" : "opacity-0"
          }`}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <span className="font-mono-num">Updated {formatElapsed(elapsed)}</span>
      <span className="hidden lg:inline-flex w-12 h-1 rounded-full bg-muted overflow-hidden">
        <span
          className="h-full bg-primary/60 transition-all duration-1000 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </span>
    </div>
  );
}