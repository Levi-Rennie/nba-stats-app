import { useMemo } from "react";
import { useGames } from "../../hooks/useGames";

const WINDOW_DAYS = 30;

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

/** A recent date window ending today. Memoised so the dates are stable per mount
 *  (and don't trigger refetches on every render). */
function useRecentWindow(days: number): { start: string; end: string } {
  return useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start: toISODate(start), end: toISODate(end) };
  }, [days]);
}

export function RecentGamesPage() {
  const { start, end } = useRecentWindow(WINDOW_DAYS);
  const state = useGames(start, end);

  if (state.status === "idle") return null; // useGames is always enabled
  if (state.status === "loading") return <p>Loading recent games…</p>;
  if (state.status === "error") {
    return <p role="alert">Couldn’t load games: {state.error.message}</p>;
  }

  // Newest first: sort by date, then game id as a same-day tie-breaker.
  const games = [...state.data].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  );

  return (
    <div>
      <h2>Recent games</h2>
      {games.length === 0 ? (
        <p>No games in the last {WINDOW_DAYS} days.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.date}: {game.visitor_team.full_name} {game.visitor_team_score}{" "}
              @ {game.home_team.full_name} {game.home_team_score}
              {game.postseason ? " (Playoffs)" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
