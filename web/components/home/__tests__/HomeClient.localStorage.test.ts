import { describe, it, expect, beforeEach, vi } from 'vitest';

const STORAGE_KEY = 'printmd-content';

describe('HomeClient localStorage pattern', () => {
  let store: ReturnType<typeof createMockStore>;

  function createMockStore() {
    let content = '';
    return {
      getContent: () => content,
      setContent: vi.fn((c: string) => { content = c; }),
    };
  }

  beforeEach(() => {
    localStorage.clear();
    store = createMockStore();
  });

  it('handleContentChange saves to both store and localStorage', () => {
    // Simulate the handleContentChange pattern from HomeClient:
    // setContent(newContent); localStorage.setItem(STORAGE_KEY, newContent);
    const handleContentChange = (newContent: string) => {
      store.setContent(newContent);
      localStorage.setItem(STORAGE_KEY, newContent);
    };

    handleContentChange('# Test content');

    expect(store.setContent).toHaveBeenCalledWith('# Test content');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('# Test content');
  });

  it('saves updated content on each change', () => {
    const handleContentChange = (newContent: string) => {
      store.setContent(newContent);
      localStorage.setItem(STORAGE_KEY, newContent);
    };

    handleContentChange('first');
    handleContentChange('second');

    expect(localStorage.getItem(STORAGE_KEY)).toBe('second');
    expect(store.setContent).toHaveBeenCalledTimes(2);
  });

  it('loads saved content from localStorage on mount', () => {
    // Pre-populate localStorage
    localStorage.setItem(STORAGE_KEY, '# Saved content');

    // Simulate the mount behavior from HomeClient:
    // const saved = localStorage.getItem(STORAGE_KEY);
    // if (saved) setContent(saved);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      store.setContent(saved);
    }

    expect(store.setContent).toHaveBeenCalledWith('# Saved content');
  });

  it('does not call setContent if localStorage is empty', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      store.setContent(saved);
    }

    expect(store.setContent).not.toHaveBeenCalled();
  });

  it('persists content across simulated page reloads', () => {
    // First "session": write content
    const handleContentChange = (newContent: string) => {
      store.setContent(newContent);
      localStorage.setItem(STORAGE_KEY, newContent);
    };
    handleContentChange('# Persistent data');

    // Second "session": create new store, load from localStorage
    const store2 = createMockStore();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      store2.setContent(saved);
    }

    expect(store2.setContent).toHaveBeenCalledWith('# Persistent data');
  });
});
