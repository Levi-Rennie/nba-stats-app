import { getPlayers } from "../api/players";
import type { Player } from "../api/schemas";
import type { AsyncState } from "./asyncState";
import { useAsync } from "./useAsync";

interface UsePlayersOptions {
  /** When false, the hook stays idle and performs no request. Defaults to true. */
  enabled?: boolean;
}

/**
 * Fetch the player list for a `search` term. Refetches when `search` (or
 * `enabled`) changes; stays idle when `enabled` is false.
 */
export function usePlayers(
  search: string,
  options: UsePlayersOptions = {},
): AsyncState<Player[]> {
  return useAsync(() => getPlayers(search).then((res) => res.data), [search], options);
}
