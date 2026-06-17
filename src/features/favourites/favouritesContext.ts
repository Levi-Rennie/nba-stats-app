import { createContext, useContext } from "react";
import type { Player } from "../../api/schemas";

export interface FavouritesContextValue {
  players: Player[];
  isFavourite: (id: number) => boolean;
  toggle: (player: Player) => void;
}

// `null` as the default sentinel lets the hook detect "used outside a provider"
// and throw, instead of every consumer having to handle undefined.
export const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
}
