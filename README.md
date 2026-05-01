# CoinPrism

> **Real-time Crypto Market Intelligence**

A premium, production-ready cryptocurrency dashboard powered by the CoinGecko API. CoinPrism delivers live market data, AI-style insights, candlestick analytics, asset comparison and a polished dark-first UI built for clarity and speed.

---

## Overview

CoinPrism turns raw crypto market data into something you can actually use at a glance: top movers, volatility, sentiment, market signal, and side-by-side comparison — all updated automatically every **30 seconds** without ever blocking the UI.

## Features

### Core
- Live top-50 cryptocurrency table (CoinGecko `/coins/markets`)
- Sortable columns: Price, 24h %, Market Cap
- Per-coin metrics: 1h %, 24h %, 7d %, and an inline **7-day sparkline**
- Instant client-side search by name or symbol
- Pagination (10 per page)
- Auto-refresh every **30s** with smart "Updated Xs ago" indicator
- **Price-flash** — cells briefly highlight green/red on price changes
- Per-coin detail modal (high/low, supply, ATH/ATL)
- Light / Dark theme toggle (persisted)

## Enhancements

- Added **1h** and **7d** percentage change columns
- Added inline **7-day sparkline** (uses `sparkline_in_7d.price`)
- Refresh interval reduced to **30 seconds** for near-real-time data
- `useMemo` applied to filtering / sorting / favorites pinning
- `React.memo` on `CoinRow` with stable callback identities
- Price-change flash highlights driven by previous-price snapshots
- Hero section + footer disclaimer

## Data Source

- **CoinGecko** `/coins/markets` with `vs_currency=usd`, `order=market_cap_desc`, `per_page=50`, `sparkline=true`, `price_change_percentage=1h,24h,7d`
- 30-second auto-refresh for near real-time data
- No mock data, no alternative price providers

## Performance

- `useMemo` for filtered + sorted + favorite-pinned coin list (deps: `coins`, `query`, `sortKey`, `sortDir`, `filter`, `favorites`)
- `React.memo` on `CoinRow` so unaffected rows skip re-renders
- Stable callback identities (`useCallback`) passed into the table
- Lightweight inline SVG sparkline — no chart library overhead

### Advanced
- **Favorites system** — star any asset, persisted in `localStorage`, pinned to the top of the table
- **Filter pills** — All · Favorites · Top Gainers · Top Losers · High Cap
- **Compare Mode** — pick up to 2 assets, see a side-by-side panel with the better value highlighted
- **Market Signal card** — Bullish / Bearish / Neutral derived from gainers/losers ratio + average % change
- **Fear & Greed Index** — sourced from alternative.me
- **AI Market Summary** — one-line natural-language read on overall market tone
- **Candlestick chart** — 7-day OHLC, custom SVG, switches to whichever coin you click
- **Heatmap** — top-12 treemap sized by market cap, colored by 24h change

### UX
- Dark theme (deep navy) with cyan→blue→purple accent gradient
- Inter for UI, JetBrains Mono for tabular numbers
- 150–200ms hover/transition timing throughout
- Skeleton loaders, error states with retry, full responsive layout

## Tech Stack

- **React 19** + **TanStack Start** (file-based routing, SSR-ready)
- **Tailwind CSS v4** (semantic OKLCH design tokens in `src/styles.css`)
- **shadcn/ui** primitives (Card, Dialog, Tabs, …)
- **CoinGecko API** for market data, **alternative.me** for Fear & Greed
- **localStorage** for favorites + theme persistence
- **Vite 7** build pipeline
- **lucide-react** icons

## Project Structure

src/
├── components/
│   ├── cryostats/
│   │   ├── Header.tsx
│   │   ├── LiveUpdated.tsx          # "Updated Xs ago" ticker
│   │   ├── Insights.tsx             # 5-card insights row
│   │   ├── MarketSignalCard.tsx     # Bullish / Bearish / Neutral
│   │   ├── FilterBar.tsx            # Pill filters
│   │   ├── MarketTable.tsx          # Search, sort, filter, pagination
│   │   ├── CoinRow.tsx              # Row with star + compare actions
│   │   ├── ComparePanel.tsx         # Side-by-side comparison panel
│   │   ├── MarketStats.tsx
│   │   ├── MarketVisuals.tsx        # Tabs: Candlestick / Heatmap
│   │   ├── CandlestickChart.tsx     # Custom SVG OHLC chart
│   │   ├── MarketTreemap.tsx        # Top-12 treemap heatmap
│   │   ├── CoinModal.tsx
│   │   └── Pagination.tsx
│   └── ui/                          # shadcn/ui primitives
├── hooks/
│   ├── use-theme.ts                 # Dark/light toggle + persistence
│   ├── use-favorites.ts             # Starred coin IDs in localStorage
│   ├── use-compare.ts               # Compare selection (max 2)
│   └── use-elapsed.ts               # Live elapsed-seconds counter
├── services/
│   └── coingecko.ts                 # API layer: markets, OHLC, Fear & Greed
├── lib/
│   ├── format.ts                    # USD / compact / pct / number formatters
│   ├── market-summary.ts            # AI-style market tone logic
│   └── utils.ts
├── routes/
│   ├── __root.tsx
│   └── index.tsx                    # Dashboard composition + refresh loop
└── styles.css                       # Design tokens (OKLCH)

## Architecture

```
┌──────────────────────────────────────────────┐
│  UI Layer(React components — src/components) │
│   Header · Insights · MarketTable · Visuals  │
└──────────────────────┬───────────────────────┘
                       │ props / callbacks
┌──────────────────────▼───────────────────────┐
│   State Layer  (Hooks — src/hooks)           │
│   useFavorites · useCompare · useTheme       │
│   useElapsed · local component state         │
└──────────────────────┬───────────────────────┘
                       │ pure functions
┌──────────────────────▼───────────────────────┐
│   Service Layer  (src/services/coingecko.ts) │
│   fetchTopCoins · fetchOhlc · fetchFearGreed │
└──────────────────────┬───────────────────────┘
                       │ HTTPS
┌──────────────────────▼───────────────────────┐
│   External APIs                              │
│   CoinGecko  ·  alternative.me (F&G)         │
└──────────────────────────────────────────────┘
```

**Data flow:** `routes/index.tsx` orchestrates a 60s refresh loop → calls the service layer → stores results in component state → passes immutable slices into pure presentational components → derived data (filter, sort, signal, summary) is computed via `useMemo` so re-renders stay cheap.

## Setup

```bash
npm install
nmp install react-loading-skeleton
npm run dev
```

App runs at `http://localhost:8080`. No API keys required (CoinGecko public endpoints).

## Performance

- **Memoization** — table filtering, sorting and compare resolution are wrapped in `useMemo` to avoid recomputation on unrelated re-renders.
- **Stable callbacks** — `useCallback` for fetchers and toggles to keep child props stable.
- **Skeletons over spinners** — perceived performance during initial load and refresh.
- **Silent refresh** — the 30s refresh runs without flipping the loading flag, so the UI never flashes.
- **SVG charts** — no heavy charting library on the critical path.

## Error Handling

- Per-fetch try/catch with a centered error card + Retry button for the main market call.
- Non-critical fetches (Fear & Greed, OHLC) fail silently with a graceful fallback message.
- Loading states everywhere via shadcn `Skeleton`.

## UI/UX Decisions

- **Color** — Semantic tokens in `oklch`. Green (`--success`) and red (`--loss`) are reserved exclusively for gain/loss signaling. Primary accent stays cyan-blue across both themes.
- **Typography** — Inter for prose, JetBrains Mono with `tabular-nums` for all financial figures, so columns line up.
- **Spacing** — 16/24px rhythm, card-based layout, soft shadows, rounded corners (radius `0.75rem`).
- **Motion** — 150–200ms transitions on hover/active, subtle scale-on-hover for icon buttons, animated ping on the live indicator.

## Future Improvements

- Multi-currency support (EUR, BTC denomination)
- Historical performance per-coin (30d / 90d / 1y)
- Portfolio tracking with P/L
- Export comparison to image / share link
