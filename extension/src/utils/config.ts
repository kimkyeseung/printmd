/**
 * Where printmd lives. Build with VITE_PRINTMD_URL=http://localhost:3000 to
 * point the extension at a local dev server (the marker content script
 * already runs there).
 */
export const PRINTMD_URL: string =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_PRINTMD_URL ||
  'https://printmd.app';

/** Open a raw Markdown file by URL (printmd fetches it). */
export function printmdSrcUrl(rawUrl: string): string {
  return `${PRINTMD_URL}/?src=${encodeURIComponent(rawUrl)}`;
}

/** Open content handed off through the extension (see background/handoff.ts). */
export function printmdHandoffUrl(id: string): string {
  return `${PRINTMD_URL}/?ext=${encodeURIComponent(id)}`;
}
