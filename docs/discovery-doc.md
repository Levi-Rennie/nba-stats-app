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
| Browse player stats | Search for a player, view their profile and season averages. |
| Compare players head-to-head | Pick two players, see key stats side by side. |
| Team stats / standings | View team info and standings *(see API note — may be a paid endpoint)*. |
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

## 8. Success criteria

- App runs locally with `npm run dev` and builds clean (`tsc` passes, no `any`).
- A user can search a player and see real stats from the API.
- Two players can be compared side by side.
- Loading and error states are handled (no blank screens on a failed request).
- Code is typed end-to-end, with API responses validated via Zod.

## 9. Open questions

- Which season(s) to default to? (Current vs. let the user pick.)
- Does the free tier return standings? (Decides feature 3's fate.)
- Where do favourites persist? (In-memory for the session, or `localStorage`?)
- How to handle the API key in a frontend-only app? (It will be visible in
  network requests — fine for a learning project, but worth noting. See
  planning doc.)
