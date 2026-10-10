/**
 * Short-lived storage for content on its way to a printmd tab.
 *
 * chrome.storage.session survives the service worker being suspended between
 * opening the tab and the page asking for the content; the in-memory map
 * covers content too large for the session quota.
 */

import type { HandoffPayload } from '../utils/handoff';

const KEY_PREFIX = 'handoff:';
/** A tab that hasn't collected its content by then never will. */
const TTL_MS = 5 * 60 * 1000;

interface StoredHandoff extends HandoffPayload {
  createdAt: number;
}

const memory = new Map<string, StoredHandoff>();

export async function storeHandoff(payload: HandoffPayload): Promise<string> {
  await pruneExpired();
  const id = crypto.randomUUID();
  const entry: StoredHandoff = { ...payload, createdAt: Date.now() };
  memory.set(id, entry);
  try {
    await chrome.storage.session.set({ [KEY_PREFIX + id]: entry });
  } catch {
    // Over the session quota: the in-memory copy has to do.
  }
  return id;
}

/** Return the content once, then forget it. */
export async function takeHandoff(id: string): Promise<HandoffPayload | null> {
  const key = KEY_PREFIX + id;
  let entry = memory.get(id) ?? null;
  if (!entry) {
    const stored = await chrome.storage.session.get(key);
    entry = (stored[key] as StoredHandoff | undefined) ?? null;
  }
  memory.delete(id);
  await chrome.storage.session.remove(key);
  if (!entry || Date.now() - entry.createdAt > TTL_MS) return null;
  const { content, format, sourceUrl, title } = entry;
  return { content, format, sourceUrl, title };
}

async function pruneExpired(): Promise<void> {
  const now = Date.now();
  for (const [id, entry] of memory) {
    if (now - entry.createdAt > TTL_MS) memory.delete(id);
  }
  const all = await chrome.storage.session.get(null);
  const expired = Object.entries(all)
    .filter(([key, value]) => key.startsWith(KEY_PREFIX) && now - (value as StoredHandoff).createdAt > TTL_MS)
    .map(([key]) => key);
  if (expired.length) await chrome.storage.session.remove(expired);
}
