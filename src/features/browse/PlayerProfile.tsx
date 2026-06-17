import { Fragment } from "react";
import type { Player } from "../../api/schemas";
import { PLAYER_ATTRIBUTES } from "../../components/playerAttributes";

interface PlayerProfileProps {
  player: Player;
  onBack: () => void;
}

export function PlayerProfile({ player, onBack }: PlayerProfileProps) {
  return (
    <div>
      <button type="button" onClick={onBack}>
        ← Back to list
      </button>

      <h2>
        {player.first_name} {player.last_name}
      </h2>

      <dl>
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
  );
}
