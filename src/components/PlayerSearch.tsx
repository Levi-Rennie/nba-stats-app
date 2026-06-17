import { useState } from "react";
import type { Player } from "../api/schemas";
import { usePlayers } from "../hooks/usePlayers";
import styles from "./PlayerSearch.module.css";

interface PlayerSearchProps {
  /** Current search text. Controlled by the parent so it can be preserved. */
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (player: Player) => void;
  /** When false, results only appear once the user searches (type-to-search). */
  autoLoad?: boolean;
  placeholder?: string;
}

export function PlayerSearch({
  query,
  onQueryChange,
  onSelect,
  autoLoad = true,
  placeholder = "Search players by name…",
}: PlayerSearchProps) {
  // Only `submittedQuery` drives the fetch, and it changes only on submit — so
  // we call the API once per search (Enter or the button), never per keystroke.
  // It seeds from `query`, so a preserved search re-runs when this remounts.
  const [submittedQuery, setSubmittedQuery] = useState(query);

  // Auto-load fetches even on an empty query (the default list). Otherwise we
  // stay idle until the user has actually searched for something.
  const enabled = autoLoad || submittedQuery.trim() !== "";
  const state = usePlayers(submittedQuery, { enabled });

  return (
    <div>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(query.trim());
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Search players"
        />
        <button type="submit" disabled={state.status === "loading"}>
          Search
        </button>
      </form>

      {state.status === "idle" && (
        <p className={styles.hint}>Search for a player by name.</p>
      )}

      {state.status === "loading" && <p className={styles.hint}>Loading players…</p>}

      {state.status === "error" && (
        <p role="alert">Couldn’t load players: {state.error.message}</p>
      )}

      {state.status === "success" &&
        (state.data.length === 0 ? (
          <p className={styles.hint}>
            No players found{submittedQuery ? ` for “${submittedQuery}”` : ""}.
          </p>
        ) : (
          <ul className={styles.list}>
            {state.data.map((player) => (
              <li key={player.id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => onSelect(player)}
                >
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
