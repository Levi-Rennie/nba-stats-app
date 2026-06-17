import { apiFetch } from "./client";
import { playersResponseSchema, type PlayersResponse } from "./schemas";

/**
 * Fetch a page of players. Phase 1 just needs a list on screen, so this takes no
 * arguments yet — search and cursor-based pagination arrive in Phase 2.
 *
 * Returns validated, typed data: the schema is passed to `apiFetch`, so the
 * caller can't receive an unvalidated shape.
 */
export function getPlayers(): Promise<PlayersResponse> {
  return apiFetch("/players?per_page=25", playersResponseSchema);
}
