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

/**
 * A player from `/players`. Free-tier fields only (bio/measurables) — there are
 * no performance stats here; those live behind the paywalled `/stats` endpoint.
 *
 * Nullability is taken from the live API (confirmed by probe): the draft fields
 * are null for undrafted players, and college/country can be absent for
 * international players. Everything `.nullable()` is a deliberate, observed case.
 */
export const playerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  position: z.string(), // can be "" — still a string
  height: z.string(),
  weight: z.string(),
  jersey_number: z.string(),
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
