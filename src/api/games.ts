import { apiFetch } from "./client";
import { createCachedFetch } from "./cache";
import { gamesResponseSchema, type GamesResponse } from "./schemas";

const fetchGames = createCachedFetch((path) => apiFetch(path, gamesResponseSchema));

/**
 * Fetch games within a date window (inclusive), as YYYY-MM-DD strings. We cap at
 * one page (per_page=100): a recent window is sparse enough to fit, which keeps
 * "recent games" to a single request against the 5/min free-tier limit.
 *
 * Cached by path, so revisiting the same window is free; failures aren't cached.
 */
export function getGames(startDate: string, endDate: string): Promise<GamesResponse> {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    per_page: "100",
  });
  return fetchGames(`/games?${params.toString()}`);
}
