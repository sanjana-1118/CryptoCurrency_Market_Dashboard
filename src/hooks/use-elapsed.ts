import { useEffect, useState } from "react";

export function useElapsed(since: Date | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!since) return null;
  const seconds = Math.max(0, Math.floor((now - since.getTime()) / 1000));
  return seconds;
}