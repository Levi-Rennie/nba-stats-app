# Discovery Doc — NBA Stats App

**Author:** Levi Rennie
**Course:** Onboarding
**Status:** Draft
**Last updated:** 2026-06-17

---

## 1. Purpose

A web app for browsing and comparing NBA player and team statistics. The
project doubles as a learning vehicle for the onboarding course — the goal is
as much about *how* it's built as *what* it does.

## 2. Why build this?

Three goals, all in scope:

- **Practice the TypeScript and tooling** being learned in the course (types,
  schema validation, build setup).
- **Produce something portfolio-worthy** — a real, working app that can be
  shown off.
- **Learn API integration and data fetching** end-to-end — auth, requests,
  loading/error states, pagination.

NBA stats are a good fit: the data is rich, there's a clean free API, and the
domain is easy to reason about (everyone understands "compare two players").

## 3. Target users

Primarily the developer (learning project). Secondarily, a casual NBA fan who
wants to look up a player, eyeball their stats, and compare a couple of players
without wading through a stats-heavy site.

## 4. Problem statement

Most NBA stats sites are dense and ad-heavy. A focused app that does a few
things cleanly — look up a player, see their numbers, compare two side by side,
check team standings — is more pleasant for a casual look-up and a clean
showcase of front-end skills.

## 5. Core features (in scope)

| Feature | Description |
|---------|-------------|
| Browse players | Search for a player, view their profile (bio/measurables — see free-tier note). |
| Compare players head-to-head | Pick two players, compare bio/measurables side by side (stats are paywalled — see note). |
| Teams | View team info, grouped by conference and division. |
| Recent games | List recent final scores from the free `/games` endpoint. |
| Search + favourites | Search players/teams; mark favourites to revisit quickly. |

## 6. Out of scope (v1)

- User accounts / login.
- A backend or database (frontend calls the API directly).
- Live game scores or real-time updates.
- Advanced/tracking stats (paid API tier).
- Mobile native app (responsive web is enough).

## 7. Data source

**BALLDONTLIE API** (`api.balldontlie.io`).

- Requires a **free API key** (free account at app.balldontlie.io), passed in an
  `Authorization` header.
- Free tier covers basic endpoints (players, teams, season averages, games)
  with documented rate limits.
- **Risk:** standings, advanced stats, and some season-average detail may sit
  behind the paid ALL-STAR (~$9.99/mo) or GOAT (~$39.99/mo) tiers. Confirm what
  the free tier returns before committing the standings feature — have a
  fallback (e.g. derive a simple standings view from team/game data, or drop it
  to "stretch").

### Free-tier findings (probed 2026-06-17) — DECISION: build on the free tier (Plan B)

Probed the live API with our key. The free tier is narrower than assumed — the
paywall hits **player stats**, not just standings:

| Endpoint | Free? | Notes |
|----------|-------|-------|
| `/players`, `/players/:id` | ✅ | Bio only: name, position, height, weight, jersey, college, country, draft info, team. |
| `/teams` | ✅ | Conference, division, city, name, abbreviation. |
| `/games` | ✅ | **Team-level** final scores (per quarter), date, season, postseason flag. No player stats. |
| `/stats` | ❌ 401 | Per-game player box scores — paywalled. |
| `/season_averages` | ❌ 401 | Player averages — paywalled. |
| `/standings` | ❌ 401 | Paywalled. |
| `/players/active` | ❌ 401 | Paywalled — the only way the API flags active vs. retired players. |

Consequences for v1 (Plan B — stay free):
- **No free source of player performance stats** (`/stats` and `/season_averages`
  are both gated). Player profile and compare are therefore **bio/measurables
  only**, not stat lines. A full stats compare is parked as a paid-tier stretch.
- **Standings is NOT viable on the free tier after all.** Deriving W–L records
  needs every game of a season (~1,230 games = ~13 paginated requests at the
  max `per_page` of 100), but the rate limit is **5 requests/minute**
  (`x-ratelimit-limit: 5`). That's ~3 minutes of throttled fetching per load and
  constant 429s. **Decision (2026-06-17): standings dropped to a stretch goal**
  (needs the paid tier's `/standings` + higher limits, or a backend).
- **Recent games is the free `/games` feature instead.** A narrow recent date
  window returns the latest final scores in a single request — honest, cheap,
  and useful.
- **No active/retired indicator.** The player object carries no `active` field,
  and `/players/active` (the API's only activity signal) is paywalled. Team
  presence doesn't help — retired players still carry a last team — so there's
  no reliable free way to show active vs. retired. Left out of v1; would need a
  paid tier.

## 8. Success criteria

- App runs locally with `npm run dev` and builds clean (`tsc` passes, no `any`).
- A user can search a player and see their real profile from the API
  (bio/measurables on the free tier).
- Two players can be compared side by side.
- Loading and error states are handled (no blank screens on a failed request).
- Code is typed end-to-end, with API responses validated via Zod.

## 9. Open questions

- Which season(s) to default to? (Current vs. let the user pick.)
- ~~Does the free tier return standings?~~ **Resolved (2026-06-17):** no — `/standings`
  is paywalled, but standings can be derived from the free `/games` endpoint.
  Player stats (`/stats`, `/season_averages`) are also paywalled; v1 goes
  bio-only on profiles/compare (Plan B).
- Where do favourites persist? (In-memory for the session, or `localStorage`?)
- How to handle the API key in a frontend-only app? (It will be visible in
  network requests — fine for a learning project, but worth noting. See
  planning doc.)
