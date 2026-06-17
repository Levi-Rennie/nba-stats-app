import { useEffect, useState } from "react";
import { getPlayers } from "../api/players";
import { ApiError } from "../api/client";
import type { Player } from "../api/schemas";

/**
 * A request's lifecycle modelled as a discriminated union on `status`.
 *
 * Why a union instead of `{ loading, error, data }` booleans? Because it makes
 * impossible states unrepresentable: you can't have `data` AND `error` at once,
 * and once you've checked `status`, TypeScript *narrows* the object so the right
 * fields are available (and the wrong ones are compile errors). The UI is forced
 * to handle every case.
 */
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; data: T };

/**
 * Fetch the player list for a given `search` term, exposing its
 * loading/error/success state to the UI. Refetches whenever `search` changes.
 */
export function usePlayers(search: string): AsyncState<Player[]> {
  const [state, setState] = useState<AsyncState<Player[]>>({ status: "loading" });

  useEffect(() => {
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
  }, [search]);

  return state;
}
