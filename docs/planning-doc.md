# Planning Doc — NBA Stats App

**Author:** Levi Rennie
**Status:** Draft
**Last updated:** 2026-06-17
**Companion to:** discovery-doc.md

---

## 1. Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React + Vite + TypeScript | Fast dev server, simple setup, good for learning. |
| Language | TypeScript (strict) | Course focus; no `any`. |
| Data fetching | `fetch` + TanStack Query *(optional)* | Native fetch is enough; TanStack Query adds caching/loading/error handling if you want to learn it. |
| Validation | Zod | Validate API responses, derive types with `z.infer`. Matches what's being learned. |
| Styling | Your choice (CSS Modules / Tailwind) | Not the focus — pick whatever's quickest. |
| State | React state + Context | No need for Redux at this scope. Favourites can live in Context. |

No backend — the app calls BALLDONTLIE directly.

## 2. Architecture

```
src/
  api/          # fetch wrappers + Zod schemas per endpoint
    client.ts       # base fetch with Authorization header, error handling
    players.ts      # getPlayers, getPlayer, getSeasonAverages
    teams.ts        # getTeams, getStandings (if available)
    schemas.ts      # Zod schemas + inferred types
  components/   # reusable UI (PlayerCard, StatTable, SearchBar, etc.)
  features/
    browse/         # player search + profile
    compare/        # head-to-head view
    teams/          # team / standings view
    favourites/     # favourites list + context
  hooks/        # useDebounce, usePlayers, etc.
  App.tsx
  main.tsx
```

Key idea: **all API access goes through `src/api/`**, and every response is
parsed through a Zod schema before it reaches the UI. The UI only ever sees
validated, typed data.

## 3. Zod / typing approach

For each endpoint, define a schema and infer the type — don't hand-write a
separate `interface`:

```ts
// schemas.ts
import { z } from "zod";

export const playerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  position: z.string(),
  team: z.object({ id: z.number(), full_name: z.string() }),
});

export type Player = z.infer<typeof playerSchema>;

export const playersResponseSchema = z.object({
  data: z.array(playerSchema),
  meta: z.object({ next_cursor: z.number().nullable().optional() }),
});
```

Then in the client, `safeParse` the response and handle the failure case
instead of trusting the shape:

```ts
const json = await res.json();
const parsed = playersResponseSchema.safeParse(json);
if (!parsed.success) {
  // surface a friendly error; log parsed.error for debugging
  throw new Error("Unexpected API response");
}
return parsed.data;
```

## 4. API key handling

The key goes in an `.env` file (Vite exposes vars prefixed with `VITE_`):

```
VITE_BDL_API_KEY=your_key_here
```

```ts
const API_KEY = import.meta.env.VITE_BDL_API_KEY;
```

> **Note:** in a frontend-only app the key *will* be visible in network
> requests. That's acceptable for a learning project, but never commit `.env`
> (add it to `.gitignore`) and don't reuse a key you care about. A real
> production app would proxy requests through a backend — out of scope here, but
> worth understanding *why*.

## 5. Milestones (1–2 weeks)

> **Free-tier reality (probed 2026-06-17 → Plan B):** `/stats`, `/season_averages`,
> and `/standings` are all paywalled. Free endpoints are `/players`, `/teams`,
> and `/games`. v1 stays on the free tier: profiles/compare are bio/measurables
> only, and standings is derived from `/games`. See discovery doc §7.

### Phase 1 — Setup & first fetch (days 1–2)
- Scaffold Vite + React + TS, strict mode on. *(Note: `tsconfig.app.json` was
  missing `"strict": true` — add it before writing `client.ts`. Also pin `zod`
  in `package.json`.)*
- ~~Confirm what the free tier returns~~ **Done** — see free-tier reality above.
- Build `client.ts` with the auth header + a basic error path.
- Fetch and `console.log` a list of players. **Goal: real data on screen.**

### Phase 2 — Browse + search (days 3–5)
- Search bar with debounced input → players endpoint.
- Player profile view (bio/measurables — no stats on the free tier).
- Zod schemas for everything touched so far; no `any`.
- Loading + error UI.

### Phase 3 — Compare (days 6–8)
- Select two players, render bio/measurables side by side.
- Reuse the profile components from browse. (Stats compare = paid-tier stretch.)

### Phase 4 — Teams + favourites (days 9–11)
- Team list; derive a W–L standings table by aggregating the free `/games` endpoint.
- Favourites via Context, persisted to `localStorage`.

### Phase 5 — Polish (days 12–14)
- Responsive layout, empty/error states, tidy styling.
- README with setup steps and a note on the architecture.
- Final `tsc` pass, remove dead code, confirm no `any`.

## 6. Definition of done

- `npm run dev` runs; `npm run build` / `tsc` passes with strict mode.
- All four core features work against live API data.
- Every API response is Zod-validated.
- Loading and error states everywhere data is fetched.
- README explains setup (including the `.env` key step).
- No `any` types anywhere.

## 7. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Standings/advanced stats are paywalled | **Confirmed paywalled (2026-06-17).** Standings derived from free `/games`; player stats dropped to paid-tier stretch (Plan B). |
| Rate limits hit during dev | Cache responses (TanStack Query or a simple in-memory map); don't refetch on every keystroke (debounce). |
| API shape differs from assumptions | Zod `safeParse` catches it early and loudly. |
| Scope creep | Stick to the four core features; park extras in "out of scope". |

## 8. Stretch goals (only if time)

- **Stats compare / season averages** — requires a paid tier (`/stats` +
  `/season_averages`); unlocks a true head-to-head stat line.
- Player stat charts (e.g. Recharts) over a season.
- Compare more than two players.
- Filter players by team/position.
- Dark mode.
