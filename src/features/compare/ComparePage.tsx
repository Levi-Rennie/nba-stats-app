import { useState } from "react";
import type { Player } from "../../api/schemas";
import { PlayerSearch } from "../../components/PlayerSearch";
import { PLAYER_ATTRIBUTES } from "../../components/playerAttributes";
import styles from "./ComparePage.module.css";

interface SlotProps {
  label: string;
  player: Player | null;
  onSelect: (player: Player) => void;
  onClear: () => void;
}

/** One pick-a-player slot: a type-to-search box, or the chosen player + Change. */
function Slot({ label, player, onSelect, onClear }: SlotProps) {
  const [query, setQuery] = useState("");

  return (
    <div className={styles.slot}>
      {player ? (
        <div className={styles.chosen}>
          <strong>
            {player.first_name} {player.last_name}
          </strong>
          <button type="button" onClick={onClear}>
            Change
          </button>
        </div>
      ) : (
        <>
          <p className={styles.slotLabel}>{label}</p>
          <PlayerSearch
            query={query}
            onQueryChange={setQuery}
            onSelect={onSelect}
            autoLoad={false}
            placeholder={`Search for ${label}…`}
          />
        </>
      )}
    </div>
  );
}

function playerName(player: Player | null, fallback: string): string {
  return player ? `${player.first_name} ${player.last_name}` : fallback;
}

export function ComparePage() {
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);

  return (
    <div>
      <h2>Compare players</h2>

      <div className={styles.slots}>
        <Slot
          label="Player 1"
          player={playerA}
          onSelect={setPlayerA}
          onClear={() => setPlayerA(null)}
        />
        <Slot
          label="Player 2"
          player={playerB}
          onSelect={setPlayerB}
          onClear={() => setPlayerB(null)}
        />
      </div>

      {/* Show the table once at least one player is picked; empty cells are "—". */}
      {(playerA || playerB) && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th />
              <th>{playerName(playerA, "Player 1")}</th>
              <th>{playerName(playerB, "Player 2")}</th>
            </tr>
          </thead>
          <tbody>
            {PLAYER_ATTRIBUTES.map((attr) => (
              <tr key={attr.label}>
                <th scope="row">{attr.label}</th>
                <td>{playerA ? attr.get(playerA) : "—"}</td>
                <td>{playerB ? attr.get(playerB) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
