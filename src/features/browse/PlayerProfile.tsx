import { Fragment } from "react";
import type { Player } from "../../api/schemas";
import { PLAYER_ATTRIBUTES } from "../../components/playerAttributes";
import { useFavourites } from "../favourites/favouritesContext";
import styles from "./PlayerProfile.module.css";

interface PlayerProfileProps {
  player: Player;
  onBack: () => void;
}

export function PlayerProfile({ player, onBack }: PlayerProfileProps) {
  const { isFavourite, toggle } = useFavourites();
  const favourited = isFavourite(player.id);

  return (
    <div>
      <button type="button" className={styles.back} onClick={onBack}>
        ← Back to list
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <h2>
            {player.first_name} {player.last_name}
          </h2>

          <button
            type="button"
            className={favourited ? styles.favActive : undefined}
            onClick={() => toggle(player)}
            aria-pressed={favourited}
          >
            {favourited ? "★ Favourited" : "☆ Add to favourites"}
          </button>
        </div>

        <dl className={styles.attrs}>
          {PLAYER_ATTRIBUTES.map((attr) => (
            // Fragment lets one list item emit both a <dt> and <dd> while still
            // carrying a stable key — labels are unique, so they make good keys.
            <Fragment key={attr.label}>
              <dt>{attr.label}</dt>
              <dd>{attr.get(player)}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
  );
}
