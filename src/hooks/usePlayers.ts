import { useEffect, useState } from "react";
import { getPlayers } from "../api/players";
import { ApiError } from "../api/client";
import type { Player } from "../api/schemas";

/**
 * A request's lifecycle modelled as a discriminated union on `status`.
 *
 * `idle` is the "not asked yet" state — used by a type-to-search box that
 * shouldn't fetch until the user types. The union makes impossible states
 * unrepresentable and lets TypeScript narrow each branch for the UI.
 */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; data: T };

interface UsePlayersOptions {
  /** When false, the hook stays idle and performs no request. Defaults to true. */
  enabled?: boolean;
}

/**
 * Fetch the player list for a `search` term, exposing its
 * idle/loading/error/success state. Refetches whenever `search` or `enabled`
 * changes; goes idle (no request) when `enabled` is false.
 */
export function usePlayers(
  search: string,
  options: UsePlayersOptions = {},
): AsyncState<Player[]> {
  const { enabled = true } = options;
  const [state, setState] = useState<AsyncState<Player[]>>(
    enabled ? { status: "loading" } : { status: "idle" },
  );

  useEffect(() => {
    if (!enabled) {
      setState({ status: "idle" });
      return;
    }

    // `ignore` guards against setting state after unmount, against React 19
    // StrictMode's deliberate double-invoke of effects in dev, and against an
    // earlier slow request resolving after a later one (out-of-order responses).
    let ignore = false;
    setState({ status: "loading" });

    getPlayers(search)
      .then((res) => {
        if (!ignore) setState({ status: "success", data: res.data });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        // Never assume the caught value's type — it's `unknown`, so narrow it.
        const error =
          err instanceof ApiError
            ? err
            : new ApiError("Something went wrong.", "network");
        setState({ status: "error", error });
      });

    return () => {
      ignore = true;
    };
  }, [search, enabled]);

  return state;
}
