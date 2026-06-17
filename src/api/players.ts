import { apiFetch } from "./client";
import { playersResponseSchema, type PlayersResponse } from "./schemas";

/**
 * Session cache of player requests, keyed by full path. Stores the in-flight
 * Promise (not just the resolved value) so simultaneous identical requests —
 * e.g. React StrictMode's double-invoke — share one network call. Lives only as
 * long as the page; a refresh starts empty. No expiry: player bios are static
 * enough that caching for the session is fine.
 */
const playersCache = new Map<string, Promise<PlayersResponse>>();

/**
 * Fetch a page of players, optionally filtered by a name `search` term.
 *
 * Query params are built with URLSearchParams so the search term is correctly
 * URL-encoded (spaces, accents, etc.) rather than concatenated by hand. An empty
 * or omitted search simply returns the default list.
 *
 * Results are cached by path, so repeating a search (or returning to the default
 * list) is free — no second request. Returns validated, typed data: the schema
 * is passed to `apiFetch`, so the caller can't receive an unvalidated shape.
 */
export function getPlayers(search?: string): Promise<PlayersResponse> {
  const params = new URLSearchParams({ per_page: "25" });
  if (search) params.set("search", search);
  const path = `/players?${params.toString()}`;

  const cached = playersCache.get(path);
  if (cached) return cached;

  const request = apiFetch(path, playersResponseSchema).catch((error: unknown) => {
    // Never cache a failure — drop it so a retry can actually hit the network.
    playersCache.delete(path);
    throw error;
  });

  playersCache.set(path, request);
  return request;
}
