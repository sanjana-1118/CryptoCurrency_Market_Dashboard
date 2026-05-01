import { TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card px-6 py-8 sm:px-10 sm:py-10">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-success/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Live market data
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">CoinPrism</h2>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Real-Time Cryptocurrency Market Dashboard
          </p>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground/80 max-w-md">
            Track, analyze, and understand market trends in real time.
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center">
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/40 shadow-xl shadow-primary/30 flex items-center justify-center">
            <TrendingUp className="h-9 w-9 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </section>
  );
}