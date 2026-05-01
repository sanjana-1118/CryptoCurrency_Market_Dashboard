export const fmtUsd = (n: number, max = 2) =>
  n >= 1
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: max })
    : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 });

export const fmtCompact = (n: number) =>
  n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });

export const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export const fmtNumber = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });
