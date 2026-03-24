import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tab, TabsStore } from '@/types/editor';

function createTab(options?: { documentId?: string | null; content?: string; title?: string }): Tab {
  return {
    id: crypto.randomUUID(),
    documentId: options?.documentId ?? null,
    title: options?.title ?? 'Untitled',
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
      partialize: (state) => ({
        // Only persist metadata, not content (to avoid localStorage size issues)
        tabs: state.tabs.map((t) => ({
          id: t.id,
          documentId: t.documentId,
          title: t.title,
          content: '',
          lastSavedContent: '',
          isDirty: false,
        })),
        activeTabId: state.activeTabId,
      }),
    }
  )
);
