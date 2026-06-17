import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { z } from "zod";
import { playerSchema, type Player } from "../../api/schemas";

const STORAGE_KEY = "nba-stats:favourite-players";

interface FavouritesContextValue {
  players: Player[];
  isFavourite: (id: number) => boolean;
  toggle: (player: Player) => void;
}

// `null` as the default sentinel lets the hook below detect "used outside a
// provider" and throw, instead of every consumer having to handle undefined.
const FavouritesContext = createContext<FavouritesContextValue | null>(null);

// localStorage is untrusted input — validate it through the same schema we use
// for API data. Anything stale or corrupt falls back to an empty list.
const storedPlayersSchema = z.array(playerSchema);

function loadInitial(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = storedPlayersSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  // Lazy initialiser: read localStorage once on mount, not every render.
  const [players, setPlayers] = useState<Player[]>(loadInitial);

  // Persist whenever the list changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  function isFavourite(id: number): boolean {
    return players.some((p) => p.id === id);
  }

  function toggle(player: Player): void {
    setPlayers((prev) =>
      prev.some((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player],
    );
  }

  return (
    <FavouritesContext.Provider value={{ players, isFavourite, toggle }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
}
