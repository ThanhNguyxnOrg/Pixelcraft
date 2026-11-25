export type JumpDetail =
  | {
      kind: "exhibit";
      id: string;
      view?: "compare" | "after" | "before" | "live" | "code" | "notes";
    }
  | { kind: "skill"; query: string }
  | { kind: "agent"; id: string }
  | { kind: "palette" };

const EVENT_NAME = "pixelcraft:jump";

export function readUrlParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export function writeUrlParams(
  updates: Record<string, string | null | undefined>,
  hash?: string,
) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(updates)) {
    if (!v) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  }
  if (hash) url.hash = hash;
  window.history.replaceState(null, "", url.toString());
}

export function dispatchJump(detail: JumpDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<JumpDetail>(EVENT_NAME, { detail }));
}

export function onJump(handler: (detail: JumpDetail) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<JumpDetail>;
    if (ce.detail) handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
