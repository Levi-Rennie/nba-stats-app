import { z } from "zod";

const BASE_URL = "https://api.balldontlie.io/v1";
const API_KEY = import.meta.env.VITE_BDL_API_KEY;

/**
 * Discriminates *how* a request failed so the UI can react appropriately
 * (e.g. a 401 paywall message vs. "you're offline" vs. "the API changed shape").
 */
export type ApiErrorKind = "config" | "network" | "http" | "validation";

export class ApiError extends Error {
  // Declared as fields (not constructor parameter properties) because the
  // scaffold sets `erasableSyntaxOnly`, which forbids parameter properties.
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

/**
 * The single choke point for every BALLDONTLIE request.
 *
 * It is generic over the Zod schema: you cannot call it without handing it a
 * schema, so "every response is validated" is enforced by the type system, not
 * by discipline. The return type is whatever the schema infers — so callers get
 * fully typed, validated data and never touch the raw response.
 */
export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!API_KEY) {
    throw new ApiError(
      "Missing VITE_BDL_API_KEY — add it to your .env file.",
      "config",
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: API_KEY },
    });
  } catch {
    // fetch only rejects on network-level failures (offline, DNS, CORS).
    throw new ApiError("Network request failed — are you online?", "network");
  }

  if (!res.ok) {
    // Non-2xx. For the free tier, 401 here means a paywalled endpoint.
    throw new ApiError(
      `Request to ${path} failed (${res.status} ${res.statusText}).`,
      "http",
      res.status,
    );
  }

  // We do not trust the shape: it's `unknown` until Zod narrows it.
  const json: unknown = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Log the detailed issues for debugging, surface a friendly error to the UI.
    console.error(`Validation failed for ${path}:`, parsed.error.issues);
    throw new ApiError("The API returned an unexpected shape.", "validation");
  }

  return parsed.data;
}
