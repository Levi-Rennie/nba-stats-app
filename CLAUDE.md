# CLAUDE.md

Project guidance for Claude Code. Read this at the start of every session.

## What this project is

An NBA stats web app built as a **learning project** for an onboarding course.
The goal is as much *how* it's built as *what* it does. See `docs/discovery-doc.md`
and `docs/planning-doc.md` for the full plan — read them before making changes.

## How I want to work

I'm **pairing** with you and **reviewing every change**. This is a learning
project, so the point is for me to understand the code, not just receive it.

- **Explain your decisions as you go** — especially TypeScript and Zod choices.
  When you pick a type, a generic, or a Zod method, say briefly why.
- **Go one step at a time for anything new to me.** Don't build three features
  in one pass. Make a change, explain it, let me review, then continue.
- **Stop and check in at natural review points** rather than running to the end
  of a phase. If I say "keep going," then move faster.
- **If I'm about to do something the hard way or there's a better pattern, tell
  me** — I'd rather learn the right approach than have it silently fixed.
- When I ask "why did you do it this way?", give me the real reasoning, including
  the trade-offs and what the alternatives would have been.

## Technical rules (non-negotiable)

- **Strict TypeScript. No `any`, ever.** If a type is genuinely unknown, use
  `unknown` and narrow it. If you're tempted to reach for `any`, stop and explain
  the problem instead.
- **Validate every API response with Zod.** Define a schema per endpoint, parse
  with `safeParse`, and handle the failure case — never trust the raw shape.
- **Derive types from schemas with `z.infer`.** Don't hand-write a separate
  `interface` that duplicates a Zod schema.
- **Handle loading and error states** anywhere data is fetched. No blank screens
  on a failed or pending request.
- Keep all API access behind `src/api/` — the UI only ever sees validated,
  typed data.

## Stack

- React + Vite + TypeScript (strict mode)
- Zod for validation
- `fetch` for requests (TanStack Query optional later — ask me first)
- Data source: BALLDONTLIE API (`api.balldontlie.io`), free tier, API key in
  an `Authorization` header

## Project structure (target)

```
src/
  api/        # fetch wrappers + Zod schemas (client.ts, players.ts, teams.ts, schemas.ts)
  components/ # reusable UI
  features/   # browse, compare, teams, favourites
  hooks/      # useDebounce, etc.
```

## API key handling

- Key lives in `.env` as `VITE_BDL_API_KEY` (Vite exposes `VITE_`-prefixed vars).
- **Never commit `.env`** — confirm it's in `.gitignore`.
- The key will be visible in network requests (frontend-only app). That's
  acceptable for this learning project; don't try to hide it with a fake backend.

## Build phases

Follow the phases in `docs/planning-doc.md` in order. Don't jump ahead:

1. Setup & first fetch — API client + log a list of players
2. Browse + search — search bar, player profile, season averages
3. Compare — two players side by side
4. Teams + favourites — team list/standings (check if standings is paywalled), favourites in localStorage
5. Polish — responsive, error states, README

## Known risk

Standings and advanced stats may be behind a paid BALLDONTLIE tier. Confirm what
the free tier returns in Phase 1 before committing the standings feature; fall
back gracefully if it's not available.

## Definition of done (per the planning doc)

- `npm run dev` runs; `tsc` / `npm run build` passes in strict mode
- All four core features work against live API data
- Every API response Zod-validated
- Loading + error states everywhere
- No `any` anywhere