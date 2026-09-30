import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createDebouncedStorage } from '../debouncedStorage';

describe('createDebouncedStorage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces writes and flushes the last value after the delay', () => {
    const storage = createDebouncedStorage(500);
    storage.setItem('k', 'a');
    storage.setItem('k', 'b');

    expect(localStorage.getItem('k')).toBeNull();
    expect(storage.getItem('k')).toBe('b');

    vi.advanceTimersByTime(500);
    expect(localStorage.getItem('k')).toBe('b');
  });

  it('flushes immediately when the page is hidden', () => {
    const storage = createDebouncedStorage(500);
    storage.setItem('k', 'draft');

    window.dispatchEvent(new Event('pagehide'));

    expect(localStorage.getItem('k')).toBe('draft');
  });

  it('survives a failing write', () => {
    const storage = createDebouncedStorage(500);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });

    storage.setItem('k', 'v');
    expect(() => vi.advanceTimersByTime(500)).not.toThrow();
    expect(warn).toHaveBeenCalled();

    setItem.mockRestore();
    warn.mockRestore();
  });
});
