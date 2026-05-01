export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  atl: number;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: { price: number[] };
}

const BASE = "https://api.coingecko.com/api/v3";

export async function fetchTopCoins(limit = 50): Promise<Coin[]> {
  const url = `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }
  return res.json();
}

export interface Ohlc {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export async function fetchOhlc(id: string, days = 7): Promise<Ohlc[]> {
  const url = `${BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`OHLC error: ${res.status}`);
  const raw: number[][] = await res.json();
  return raw.map(([t, o, h, l, c]) => ({ t, o, h, l, c }));
}

export interface FearGreed {
  value: number;
  classification: string;
  updatedAt: number;
}

export async function fetchFearGreed(): Promise<FearGreed> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1");
  if (!res.ok) throw new Error(`F&G error: ${res.status}`);
  const j = await res.json();
  const d = j.data?.[0];
  return {
    value: Number(d.value),
    classification: d.value_classification,
    updatedAt: Number(d.timestamp) * 1000,
  };
}
