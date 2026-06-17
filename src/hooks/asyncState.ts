import type { ApiError } from "../api/client";

/**
 * A request's lifecycle modelled as a discriminated union on `status`. Shared by
 * every data-fetching hook so they expose one consistent shape to the UI.
 *
 * `idle` is the "not asked yet" state — used by a type-to-search box that
 * shouldn't fetch until the user acts. The union makes impossible states
 * unrepresentable and lets TypeScript narrow each branch for the UI.
 */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; data: T };
