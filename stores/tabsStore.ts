import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Tab, TabsState, TabsStore } from '@/types/editor';
import { createDebouncedStorage } from '@/lib/storage/debouncedStorage';
import { DEFAULT_TAB_TITLE } from '@/lib/editor/tabTitle';

type PersistedTab = Pick<Tab, 'id' | 'documentId' | 'title' | 'content' | 'isDirty'>;

interface PersistedTabs {
  tabs: PersistedTab[];
  activeTabId: string | null;
}

/**
 * Persist a tab's content only when it exists nowhere else: tabs that were
 * never saved as a document, and saved documents with unsaved edits. A clean
 * document tab is restored from the documents store instead, which keeps
 * localStorage from holding two copies of every open document.
 */
export function serializeTabs(state: TabsState): PersistedTabs {
  return {
    tabs: state.tabs.map((t) => ({
      id: t.id,
      documentId: t.documentId,
      title: t.title,
      content: t.documentId === null || t.isDirty ? t.content : '',
      isDirty: t.isDirty,
    })),
    activeTabId: state.activeTabId,
  };
}

/**
 * Inverse of serializeTabs. `lastSavedContent` is not stored: for a clean
 * tab it equals the content, and for a document tab it is filled in from the
 * document by `restoreTabFromDocument` once the documents store is available.
 */
export function deserializeTabs(persisted: PersistedTabs): TabsState {
  return {
    tabs: persisted.tabs.map((t) => ({
      ...t,
      lastSavedContent: t.isDirty ? '' : t.content,
    })),
    activeTabId: persisted.activeTabId,
  };
}

function createTab(options?: { documentId?: string | null; content?: string; title?: string }): Tab {
  return {
    id: crypto.randomUUID(),
    documentId: options?.documentId ?? null,
    title: options?.title ?? DEFAULT_TAB_TITLE,
    content: options?.content ?? '',
    lastSavedContent: options?.content ?? '',
    isDirty: false,
  };
}

export const useTabsStore = create<TabsStore>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      addTab: (options) => {
        const tab = createTab(options);
        set((state) => ({
          tabs: [...state.tabs, tab],
          activeTabId: tab.id,
        }));
        return tab.id;
      },

      removeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        const idx = tabs.findIndex((t) => t.id === tabId);
        if (idx === -1) return;

        const newTabs = tabs.filter((t) => t.id !== tabId);

        if (newTabs.length === 0) {
          // Last tab closed — create a new empty tab
          const newTab = createTab();
          set({ tabs: [newTab], activeTabId: newTab.id });
          return;
        }

        let newActiveId = activeTabId;
        if (activeTabId === tabId) {
          // Activate adjacent tab
          const newIdx = idx >= newTabs.length ? newTabs.length - 1 : idx;
          newActiveId = newTabs[newIdx].id;
        }
        set({ tabs: newTabs, activeTabId: newActiveId });
      },

      setActiveTab: (tabId) => {
        set({ activeTabId: tabId });
      },

      updateTabContent: (tabId, content) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? { ...t, content, isDirty: content !== t.lastSavedContent }
              : t
          ),
        }));
      },

      markTabSaved: (tabId, documentId?, title?) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? {
                  ...t,
                  isDirty: false,
                  lastSavedContent: t.content,
                  ...(documentId !== undefined && { documentId }),
                  ...(title !== undefined && { title }),
                }
              : t
          ),
        }));
      },

      restoreTabFromDocument: (tabId, savedContent) => {
        set((state) => ({
          tabs: state.tabs.map((t) => {
            if (t.id !== tabId) return t;
            // Unsaved edits survive the reload; otherwise load the document.
            const content = t.isDirty ? t.content : savedContent;
            return {
              ...t,
              content,
              lastSavedContent: savedContent,
              isDirty: content !== savedContent,
            };
          }),
        }));
      },

      updateTabTitle: (tabId, title) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, title } : t
          ),
        }));
      },

      getActiveTab: () => {
        const { tabs, activeTabId } = get();
        return tabs.find((t) => t.id === activeTabId);
      },
    }),
    {
      name: 'printmd-tabs',
      storage: createJSONStorage(() => createDebouncedStorage()),
      partialize: (state) => serializeTabs(state),
      merge: (persisted, current) => ({
        ...current,
        ...deserializeTabs(persisted as PersistedTabs),
      }),
    }
  )
);
