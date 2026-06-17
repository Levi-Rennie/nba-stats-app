import type { Player } from "../api/schemas";

/**
 * One displayable attribute of a player: a label plus a function that derives
 * its display string from a Player. Centralising these means the profile and the
 * compare view render the *same* fields the *same* way — no duplicated logic to
 * drift apart.
 */
export interface PlayerAttribute {
  label: string;
  get: (player: Player) => string;
}

/** Show "—" for anything missing — covers both null and empty-string fields. */
function show(value: string | null): string {
  return value && value.trim() !== "" ? value : "—";
}

/** Draft fields are independently nullable, so build the line defensively. */
function formatDraft(player: Player): string {
  if (player.draft_year === null) return "Undrafted";
  const parts = [`${player.draft_year}`];
  if (player.draft_round !== null) parts.push(`Round ${player.draft_round}`);
  if (player.draft_number !== null) parts.push(`Pick ${player.draft_number}`);
  return parts.join(" · ");
}

export const PLAYER_ATTRIBUTES: PlayerAttribute[] = [
  { label: "Team", get: (p) => p.team.full_name },
  { label: "Position", get: (p) => show(p.position) },
  { label: "Height", get: (p) => show(p.height) },
  { label: "Weight", get: (p) => (p.weight ? `${p.weight} lb` : "—") },
  { label: "Jersey", get: (p) => show(p.jersey_number) },
  { label: "College", get: (p) => show(p.college) },
  { label: "Country", get: (p) => show(p.country) },
  { label: "Draft", get: formatDraft },
];
