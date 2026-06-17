import { getGames } from "../api/games";
import type { Game } from "../api/schemas";
import type { AsyncState } from "./asyncState";
import { useAsync } from "./useAsync";

/** Fetch games in a date window (YYYY-MM-DD). Refetches if the window changes. */
export function useGames(startDate: string, endDate: string): AsyncState<Game[]> {
  return useAsync(
    () => getGames(startDate, endDate).then((res) => res.data),
    [startDate, endDate],
  );
}
