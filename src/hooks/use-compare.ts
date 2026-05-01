import { useCallback, useState } from "react";

export function useCompare(max = 2) {
  const [ids, setIds] = useState<string[]>([]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= max) return [...prev.slice(1), id];
        return [...prev, id];
      });
    },
    [max],
  );

  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, clear, has };
}