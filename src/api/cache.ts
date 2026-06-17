/**
 * Wrap a path-based fetcher with a session cache keyed by path.
 *
 * - Stores the in-flight Promise (not just the resolved value), so concurrent
 *   identical calls — e.g. React StrictMode's double-invoke — share one request.
 * - Drops failures from the cache so a retry can actually hit the network again.
 * - Type-safe with no casts: `T` is fixed by the fetcher passed to each call,
 *   so each cache only ever holds one response type.
 *
 * The cache lives for the page session; a refresh starts empty. Fine here —
 * player/team/game data is static enough not to need expiry.
 */
export function createCachedFetch<T>(
  fetcher: (path: string) => Promise<T>,
): (path: string) => Promise<T> {
  const cache = new Map<string, Promise<T>>();

  return (path: string): Promise<T> => {
    const cached = cache.get(path);
    if (cached) return cached;

    const request = fetcher(path).catch((error: unknown) => {
      cache.delete(path);
      throw error;
    });

    cache.set(path, request);
    return request;
  };
}
