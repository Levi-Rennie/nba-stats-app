# NBA Stats

A small NBA stats web app — browse and search players, compare two players side
by side, view teams, see recent games, and save favourites. Built with React +
Vite + TypeScript (strict) and Zod, against the free tier of the
[BALLDONTLIE API](https://www.balldontlie.io/).

This started as a learning project; see `docs/discovery-doc.md` and
`docs/planning-doc.md` for the original plan and the decisions made along the way.

## Features

- **Browse** — search players by name and view a player's profile (bio / measurables).
- **Compare** — pick two players and compare their details side by side.
- **Teams** — the 30 active NBA teams, grouped by conference and division.
- **Recent games** — the latest final scores.
- **Favourites** — star players to revisit; persisted in `localStorage`.

## Getting started

Requires Node.js 20+.

```bash
npm install
```

### API key

The app calls BALLDONTLIE directly and needs a free API key:

1. Create a free account at [app.balldontlie.io](https://app.balldontlie.io/) and copy your API key.
2. Create a `.env` file in the project root:

   ```
   VITE_BDL_API_KEY=your_key_here
   ```

`.env` is gitignored. Vite only exposes variables prefixed with `VITE_`.

> **Note:** this is a frontend-only app, so the key is visible in network
> requests — that's an accepted trade-off for a learning project. A production
> app would proxy requests through a backend to keep the key server-side.

### Run

```bash
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check (tsc) + production build
npm run preview  # preview the production build
npm run lint     # eslint
```

## Free-tier limitations

The BALLDONTLIE free tier shaped what this app does. Confirmed by probing the
live API:

- **Players and teams** endpoints are free (bio/measurables, team info).
- **`/games`** is free (team-level final scores) — this powers Recent Games.
- **Player stats** (`/stats`, `/season_averages`) are **paywalled**, so profiles
  and compare show bio/measurables only — not performance stats.
- **Standings** (`/standings`) is paywalled. Deriving it from `/games` isn't
  viable either: a season is ~1,230 games (~13 paginated requests) against a
  **5 requests/minute** rate limit. Standings is therefore a stretch goal.
- **Active/retired status** isn't exposed on the free tier.

To stay within the rate limit, the app uses **submit-based search** (one request
per search, not per keystroke), an **in-memory request cache**, and keeps tab
state mounted so switching tabs doesn't refetch.

## Architecture

```
src/
  api/         # all network access, behind validated wrappers
    client.ts      # base fetch: auth header, error handling, Zod validation
    cache.ts       # createCachedFetch: per-path request cache + de-dupe
    schemas.ts     # Zod schemas; types derived via z.infer
    players.ts / teams.ts / games.ts
  hooks/
    useAsync.ts    # generic fetch state machine (idle/loading/error/success)
    usePlayers / useTeams / useGames  # thin wrappers over useAsync
  components/    # reusable UI (PlayerSearch, shared player attributes)
  features/      # browse, compare, teams, games, favourites
```

Key conventions:

- **All API access goes through `src/api/`.** Every response is parsed with a Zod
  schema (`safeParse`) before reaching the UI, and types are derived from those
  schemas with `z.infer` — the UI only ever sees validated, typed data.
- **Strict TypeScript, no `any`.** Unknown shapes (e.g. `response.json()`,
  `localStorage`) are typed `unknown` and narrowed by validation.
- **Loading and error states everywhere**, modelled as a discriminated union so
  the compiler enforces handling each case.
- **Styling** uses CSS Modules per component plus a small global theme
  (`index.css`) with light/dark support.
