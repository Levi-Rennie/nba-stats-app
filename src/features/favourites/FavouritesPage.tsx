import { useState } from "react";
import type { Player } from "../../api/schemas";
import { PlayerProfile } from "../browse/PlayerProfile";
import { useFavourites } from "./FavouritesContext";

export function FavouritesPage() {
  const { players, toggle } = useFavourites();
  const [selected, setSelected] = useState<Player | null>(null);

  if (selected) {
    return <PlayerProfile player={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <h2>Favourites</h2>

      {players.length === 0 ? (
        <p>No favourites yet — add players from their profile.</p>
      ) : (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              <button type="button" onClick={() => setSelected(player)}>
                {player.first_name} {player.last_name} — {player.team.full_name}
                {player.position ? ` (${player.position})` : ""}
              </button>{" "}
              <button
                type="button"
                onClick={() => toggle(player)}
                aria-label={`Remove ${player.first_name} ${player.last_name} from favourites`}
              >
                ★ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
