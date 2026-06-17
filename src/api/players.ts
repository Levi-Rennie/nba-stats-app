import { apiFetch } from "./client";
import { createCachedFetch } from "./cache";
import { playersResponseSchema, type PlayersResponse } from "./schemas";

const fetchPlayers = createCachedFetch((path) => apiFetch(path, playersResponseSchema));

/**
 * Fetch a page of players, optionally filtered by a name `search` term.
 *
 * Query params are built with URLSearchParams so the search term is correctly
 * URL-encoded (spaces, accents, etc.). Results are cached by path, so repeating
 * a search (or returning to the default list) is free. Returns validated, typed
 * data — the schema is passed to apiFetch, so callers can't get an unvalidated shape.
 */
export function getPlayers(search?: string): Promise<PlayersResponse> {
  const params = new URLSearchParams({ per_page: "25" });
  if (search) params.set("search", search);
  return fetchPlayers(`/players?${params.toString()}`);
}
