import { describe, it, expect, beforeEach } from 'vitest';
import { useTabsStore } from '../tabsStore';

function resetStore() {
  useTabsStore.setState({ tabs: [], activeTabId: null });
}

describe('tabsStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('addTab', () => {
    it('creates a new empty tab and sets it active', () => {
      const id = useTabsStore.getState().addTab();
      const { tabs, activeTabId } = useTabsStore.getState();

      expect(tabs).toHaveLength(1);
      expect(activeTabId).toBe(id);
      expect(tabs[0].title).toBe('Untitled');
      expect(tabs[0].content).toBe('');
      expect(tabs[0].documentId).toBeNull();
      expect(tabs[0].isDirty).toBe(false);
    });

    it('creates a tab with provided options', () => {
      const id = useTabsStore.getState().addTab({
        documentId: 'doc-1',
        content: '# Hello',
        title: 'My Doc',
      });
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.documentId).toBe('doc-1');
      expect(tab.content).toBe('# Hello');
      expect(tab.lastSavedContent).toBe('# Hello');
      expect(tab.title).toBe('My Doc');
      expect(tab.isDirty).toBe(false);
    });

    it('appends multiple tabs', () => {
      useTabsStore.getState().addTab({ title: 'Tab 1' });
      const id2 = useTabsStore.getState().addTab({ title: 'Tab 2' });
      const { tabs, activeTabId } = useTabsStore.getState();

      expect(tabs).toHaveLength(2);
      expect(activeTabId).toBe(id2); // last added is active
    });
  });

  describe('removeTab', () => {
    it('removes a tab', () => {
      const id1 = useTabsStore.getState().addTab({ title: 'Tab 1' });
      useTabsStore.getState().addTab({ title: 'Tab 2' });

      useTabsStore.getState().removeTab(id1);
      const { tabs } = useTabsStore.getState();

      expect(tabs).toHaveLength(1);
      expect(tabs[0].title).toBe('Tab 2');
    });

    it('activates adjacent tab when active tab is closed', () => {
      const id1 = useTabsStore.getState().addTab({ title: 'Tab 1' });
      const id2 = useTabsStore.getState().addTab({ title: 'Tab 2' });
      useTabsStore.getState().setActiveTab(id1);

      useTabsStore.getState().removeTab(id1);
      expect(useTabsStore.getState().activeTabId).toBe(id2);
    });

    it('activates last tab when closing the rightmost tab', () => {
      const id1 = useTabsStore.getState().addTab({ title: 'Tab 1' });
      const id2 = useTabsStore.getState().addTab({ title: 'Tab 2' });
      useTabsStore.getState().setActiveTab(id2);

      useTabsStore.getState().removeTab(id2);
      expect(useTabsStore.getState().activeTabId).toBe(id1);
    });

    it('creates a new empty tab when last tab is closed', () => {
      const id = useTabsStore.getState().addTab({ title: 'Only Tab' });

      useTabsStore.getState().removeTab(id);
      const { tabs, activeTabId } = useTabsStore.getState();

      expect(tabs).toHaveLength(1);
      expect(tabs[0].title).toBe('Untitled');
      expect(tabs[0].content).toBe('');
      expect(activeTabId).toBe(tabs[0].id);
    });

    it('does not change activeTabId when non-active tab is closed', () => {
      const id1 = useTabsStore.getState().addTab({ title: 'Tab 1' });
      const id2 = useTabsStore.getState().addTab({ title: 'Tab 2' });
      useTabsStore.getState().setActiveTab(id2);

      useTabsStore.getState().removeTab(id1);
      expect(useTabsStore.getState().activeTabId).toBe(id2);
    });

    it('ignores invalid tabId', () => {
      useTabsStore.getState().addTab({ title: 'Tab 1' });
      useTabsStore.getState().removeTab('nonexistent');

      expect(useTabsStore.getState().tabs).toHaveLength(1);
    });
  });

  describe('setActiveTab', () => {
    it('changes the active tab', () => {
      const id1 = useTabsStore.getState().addTab({ title: 'Tab 1' });
      useTabsStore.getState().addTab({ title: 'Tab 2' });

      useTabsStore.getState().setActiveTab(id1);
      expect(useTabsStore.getState().activeTabId).toBe(id1);
    });
  });

  describe('updateTabContent', () => {
    it('updates content and sets isDirty when content differs from lastSavedContent', () => {
      const id = useTabsStore.getState().addTab({ content: 'original' });

      useTabsStore.getState().updateTabContent(id, 'modified');
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.content).toBe('modified');
      expect(tab.isDirty).toBe(true);
    });

    it('sets isDirty false when content matches lastSavedContent', () => {
      const id = useTabsStore.getState().addTab({ content: 'original' });

      useTabsStore.getState().updateTabContent(id, 'modified');
      useTabsStore.getState().updateTabContent(id, 'original');
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.isDirty).toBe(false);
    });

    it('does not affect other tabs', () => {
      const id1 = useTabsStore.getState().addTab({ content: 'tab1' });
      const id2 = useTabsStore.getState().addTab({ content: 'tab2' });

      useTabsStore.getState().updateTabContent(id1, 'tab1-modified');

      const tab2 = useTabsStore.getState().tabs.find((t) => t.id === id2)!;
      expect(tab2.content).toBe('tab2');
      expect(tab2.isDirty).toBe(false);
    });
  });

  describe('markTabSaved', () => {
    it('resets isDirty and updates lastSavedContent', () => {
      const id = useTabsStore.getState().addTab({ content: 'original' });
      useTabsStore.getState().updateTabContent(id, 'modified');

      useTabsStore.getState().markTabSaved(id);
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.isDirty).toBe(false);
      expect(tab.lastSavedContent).toBe('modified');
    });

    it('updates documentId and title when provided', () => {
      const id = useTabsStore.getState().addTab();

      useTabsStore.getState().markTabSaved(id, 'doc-123', 'Saved Doc');
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.documentId).toBe('doc-123');
      expect(tab.title).toBe('Saved Doc');
    });

    it('does not change documentId/title when not provided', () => {
      const id = useTabsStore.getState().addTab({
        documentId: 'doc-1',
        title: 'Original',
        content: 'content',
      });
      useTabsStore.getState().updateTabContent(id, 'changed');

      useTabsStore.getState().markTabSaved(id);
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.documentId).toBe('doc-1');
      expect(tab.title).toBe('Original');
    });
  });

  describe('updateTabTitle', () => {
    it('updates only the title without affecting isDirty', () => {
      const id = useTabsStore.getState().addTab({ content: 'content', title: 'Old' });
      useTabsStore.getState().updateTabContent(id, 'modified');

      useTabsStore.getState().updateTabTitle(id, 'New Title');
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.title).toBe('New Title');
      expect(tab.isDirty).toBe(true); // unchanged
    });
  });

  describe('getActiveTab', () => {
    it('returns the active tab', () => {
      const id = useTabsStore.getState().addTab({ title: 'Active' });
      const tab = useTabsStore.getState().getActiveTab();

      expect(tab).toBeDefined();
      expect(tab!.id).toBe(id);
      expect(tab!.title).toBe('Active');
    });

    it('returns undefined when no tabs exist', () => {
      expect(useTabsStore.getState().getActiveTab()).toBeUndefined();
    });
  });

  describe('dirty dot logic', () => {
    it('new tab (no documentId) is never dirty even with content changes', () => {
      const id = useTabsStore.getState().addTab();
      useTabsStore.getState().updateTabContent(id, 'some text');
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      // isDirty is true but the red dot condition is: isDirty && documentId !== null
      expect(tab.isDirty).toBe(true);
      expect(tab.documentId).toBeNull();
      // So the UI should NOT show the red dot
      expect(tab.isDirty && tab.documentId !== null).toBe(false);
    });

    it('saved document shows dirty dot when modified', () => {
      const id = useTabsStore.getState().addTab({
        documentId: 'doc-1',
        content: 'saved content',
      });
      useTabsStore.getState().updateTabContent(id, 'modified');
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.isDirty && tab.documentId !== null).toBe(true);
    });

    it('saved document hides dirty dot after save', () => {
      const id = useTabsStore.getState().addTab({
        documentId: 'doc-1',
        content: 'saved content',
      });
      useTabsStore.getState().updateTabContent(id, 'modified');
      useTabsStore.getState().markTabSaved(id);
      const tab = useTabsStore.getState().tabs.find((t) => t.id === id)!;

      expect(tab.isDirty && tab.documentId !== null).toBe(false);
    });
  });

  describe('duplicate document prevention', () => {
    it('tabs with same documentId can be found', () => {
      useTabsStore.getState().addTab({ documentId: 'doc-1', title: 'Doc 1' });
      useTabsStore.getState().addTab({ documentId: 'doc-2', title: 'Doc 2' });

      const { tabs } = useTabsStore.getState();
      const existing = tabs.find((t) => t.documentId === 'doc-1');

      expect(existing).toBeDefined();
      expect(existing!.title).toBe('Doc 1');
    });
  });
});
