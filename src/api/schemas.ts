import { z } from "zod";

/**
 * A team, as returned both by the `/teams` endpoint and nested inside a player.
 * Defined once and reused so there's a single source of truth for the shape.
 */
export const teamSchema = z.object({
  id: z.number(),
  conference: z.string(),
  division: z.string(),
  city: z.string(),
  name: z.string(),
  full_name: z.string(),
  abbreviation: z.string(),
});
export type Team = z.infer<typeof teamSchema>;

/** The /teams list response — just a data array, no pagination meta. */
export const teamsResponseSchema = z.object({
  data: z.array(teamSchema),
});
export type TeamsResponse = z.infer<typeof teamsResponseSchema>;

/**
 * A player from `/players`. Free-tier fields only (bio/measurables) — there are
 * no performance stats here; those live behind the paywalled `/stats` endpoint.
 *
 * Nullability is taken from the live API: only id and name are guaranteed. Every
 * other bio field can be null for sparsely-documented players (e.g. "Luka
 * Mitrovic" has null height/weight/jersey), and the draft fields are null for
 * undrafted players. Each `.nullable()` reflects a value the API actually returns.
 */
export const playerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  position: z.string().nullable(),
  height: z.string().nullable(),
  weight: z.string().nullable(),
  jersey_number: z.string().nullable(),
  college: z.string().nullable(),
  country: z.string().nullable(),
  draft_year: z.number().nullable(),
  draft_round: z.number().nullable(),
  draft_number: z.number().nullable(),
  team: teamSchema,
});
export type Player = z.infer<typeof playerSchema>;

/** Cursor-based pagination metadata that BALLDONTLIE attaches to list responses. */
export const metaSchema = z.object({
  // null/absent on the last page — model both rather than assume it's always present.
  next_cursor: z.number().nullable().optional(),
  per_page: z.number(),
});

/** The full `/players` list response: a data array plus pagination meta. */
export const playersResponseSchema = z.object({
  data: z.array(playerSchema),
  meta: metaSchema,
});
export type PlayersResponse = z.infer<typeof playersResponseSchema>;

/**
 * A game from `/games`. We model only the fields the Recent Games view needs —
 * Zod strips unknown keys by default, so the many per-quarter/timeout fields the
 * API also returns are simply ignored. Scores are always numbers (confirmed by
 * probe); the nested teams reuse teamSchema.
 */
export const gameSchema = z.object({
  id: z.number(),
  date: z.string(),
  season: z.number(),
  status: z.string(),
  postseason: z.boolean(),
  home_team: teamSchema,
  visitor_team: teamSchema,
  home_team_score: z.number(),
  visitor_team_score: z.number(),
});
export type Game = z.infer<typeof gameSchema>;

/** The `/games` list response: a data array plus cursor pagination meta. */
export const gamesResponseSchema = z.object({
  data: z.array(gameSchema),
  meta: metaSchema,
});
export type GamesResponse = z.infer<typeof gamesResponseSchema>;
