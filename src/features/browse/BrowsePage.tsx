import { useState } from "react";
import type { Player } from "../../api/schemas";
import { useDebounce } from "../../hooks/useDebounce";
import { usePlayers } from "../../hooks/usePlayers";
import { PlayerProfile } from "./PlayerProfile";

export function BrowsePage() {
  // `query` tracks every keystroke; `debouncedQuery` is what we actually fetch
  // on — so we hit the API only after the user pauses, not on every character.
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Player | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const state = usePlayers(debouncedQuery);

  // Hooks above always run; only the rendered output is conditional, so this
  // early return is safe. The list state (query, results) is preserved while
  // viewing a profile, so going back lands you where you were.
  if (selected) {
    return (
      <PlayerProfile player={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search players by name…"
        aria-label="Search players"
      />

      {state.status === "loading" && <p>Loading players…</p>}

      {state.status === "error" && (
        <p role="alert">Couldn’t load players: {state.error.message}</p>
      )}

      {state.status === "success" &&
        (state.data.length === 0 ? (
          <p>
            No players found{debouncedQuery ? ` for “${debouncedQuery}”` : ""}.
          </p>
        ) : (
          <ul>
            {state.data.map((player) => (
              <li key={player.id}>
                <button type="button" onClick={() => setSelected(player)}>
                  {player.first_name} {player.last_name} — {player.team.full_name}
                  {player.position ? ` (${player.position})` : ""}
                </button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
