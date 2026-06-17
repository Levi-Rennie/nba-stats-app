import { apiFetch } from "./client";
import { createCachedFetch } from "./cache";
import { teamsResponseSchema, type TeamsResponse } from "./schemas";

const fetchTeams = createCachedFetch((path) => apiFetch(path, teamsResponseSchema));

/** Fetch all teams (validated, typed). Cached for the session after first call. */
export function getTeams(): Promise<TeamsResponse> {
  return fetchTeams("/teams");
}
