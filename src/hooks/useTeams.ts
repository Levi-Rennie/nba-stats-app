import { getTeams } from "../api/teams";
import type { Team } from "../api/schemas";
import type { AsyncState } from "./asyncState";
import { useAsync } from "./useAsync";

/** Fetch the full team list once (no params, so empty deps). */
export function useTeams(): AsyncState<Team[]> {
  return useAsync(() => getTeams().then((res) => res.data), []);
}
