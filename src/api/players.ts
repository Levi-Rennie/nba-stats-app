import { apiFetch } from "./client";
import { playersResponseSchema, type PlayersResponse } from "./schemas";

/**
 * Fetch a page of players, optionally filtered by a name `search` term.
 *
 * Query params are built with URLSearchParams so the search term is correctly
 * URL-encoded (spaces, accents, etc.) rather than concatenated by hand. An empty
 * or omitted search simply returns the default list.
 *
 * Returns validated, typed data: the schema is passed to `apiFetch`, so the
 * caller can't receive an unvalidated shape.
 */
export function getPlayers(search?: string): Promise<PlayersResponse> {
  const params = new URLSearchParams({ per_page: "25" });
  if (search) params.set("search", search);
  return apiFetch(`/players?${params.toString()}`, playersResponseSchema);
}
