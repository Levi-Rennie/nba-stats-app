import { useEffect, useState, type DependencyList } from "react";
import { ApiError } from "../api/client";
import type { AsyncState } from "./asyncState";

interface UseAsyncOptions {
  /** When false, the hook stays idle and runs no fetch. Defaults to true. */
  enabled?: boolean;
}

/**
 * Generic data-fetching state machine: runs `fetcher` and tracks
 * idle/loading/error/success. Re-runs whenever `deps` (or `enabled`) change.
 *
 * The `ignore` flag guards against setting state after unmount, against React 19
 * StrictMode's deliberate double-invoke in dev, and against an earlier slow
 * request resolving after a later one (out-of-order responses).
 */
export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
  options: UseAsyncOptions = {},
): AsyncState<T> {
  const { enabled = true } = options;
  const [state, setState] = useState<AsyncState<T>>(
    enabled ? { status: "loading" } : { status: "idle" },
  );

  useEffect(() => {
    // Disabled: don't fetch. We report `idle` from the return below rather than
    // setState here, which would trigger a needless cascading render.
    if (!enabled) return;

    let ignore = false;
    // Transition to loading at the start of the fetch. This is the intended
    // data-fetching pattern (and drives the loading UI / disabled Search button);
    // it's a single state set, not a cascading render. The rule's blessed
    // alternative is a fetch library/Suspense, which this project deliberately
    // hand-rolls instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: "loading" });

    fetcher()
      .then((data) => {
        if (!ignore) setState({ status: "success", data });
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
    // The effect is keyed on `deps` (what the fetcher closes over) plus `enabled`,
    // not on the fetcher's identity, which is a new closure every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled]);

  // When disabled we present idle directly rather than storing it, so the effect
  // never has to setState just to reset.
  return enabled ? state : { status: "idle" };
}
