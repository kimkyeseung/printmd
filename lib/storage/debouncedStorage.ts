import type { StateStorage } from 'zustand/middleware';

/**
 * localStorage wrapper that batches writes.
 *
 * zustand's persist middleware writes on every state change. For the tabs
 * store that means serializing every open draft on every keystroke, so writes
 * are coalesced and flushed after a pause — or immediately when the page is
 * hidden or unloaded, so a refresh or tab close never drops the last edit.
 */
export function createDebouncedStorage(delay = 500): StateStorage {
  // Accessing localStorage throws on the server; createJSONStorage catches
  // that and disables persistence there, same as with plain localStorage.
  const storage = window.localStorage;
  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    for (const [key, value] of pending) {
      try {
        storage.setItem(key, value);
      } catch (error) {
        // Most likely QuotaExceededError. Keep the app usable; the in-memory
        // state is still intact.
        console.warn(`[printmd] Failed to persist "${key}"`, error);
      }
    }
    pending.clear();
  };

  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });

  return {
    getItem: (key) => pending.get(key) ?? storage.getItem(key),
    setItem: (key, value) => {
      pending.set(key, value);
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, delay);
    },
    removeItem: (key) => {
      pending.delete(key);
      storage.removeItem(key);
    },
  };
}
