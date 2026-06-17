import { useState } from "react";
import type { Player } from "../../api/schemas";
import { PlayerSearch } from "../../components/PlayerSearch";
import { PlayerProfile } from "./PlayerProfile";

export function BrowsePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Player | null>(null);

  // `query` lives here (not inside PlayerSearch) so the typed text survives the
  // round-trip into a profile and back.
  if (selected) {
    return (
      <PlayerProfile player={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <PlayerSearch query={query} onQueryChange={setQuery} onSelect={setSelected} />
  );
}
