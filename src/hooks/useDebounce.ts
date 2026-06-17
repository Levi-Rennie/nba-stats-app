import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delayMs` has
 * passed with no further changes. Generic over `T` so it works for any value
 * (a search string here, but it could debounce anything).
 *
 * How it works: every time `value` changes we start a timer; the effect cleanup
 * cancels the previous timer first, so rapid changes keep resetting it and the
 * debounced value only catches up once typing pauses.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
