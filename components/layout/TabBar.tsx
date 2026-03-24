'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useTabsStore } from '@/stores';
import type { Tab } from '@/types/editor';

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TabItem({
  tab,
  isActive,
  onSelect,
  onClose,
}: {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const showDirtyDot = tab.isDirty && tab.documentId !== null;

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose],
  );

  const handleMiddleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  return (
    <div
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      onMouseDown={handleMiddleClick}
      className={`group relative flex items-center gap-1.5 shrink-0 cursor-pointer select-none border-r border-[var(--ui-border)] px-3 py-1.5 text-xs transition-colors ${
        isActive
          ? 'bg-[var(--background)] text-[var(--foreground)]'
          : 'bg-[var(--ui-bg-secondary,var(--ui-bg-hover))] text-[var(--ui-text-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
      }`}
    >
      {/* Dirty dot */}
      {showDirtyDot && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
      )}

      {/* Title */}
      <span className="max-w-[120px] truncate">{tab.title}</span>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="ml-0.5 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-[var(--ui-bg-hover)] transition-opacity"
        aria-label={`Close ${tab.title}`}
      >
        <CloseIcon className="h-3 w-3" />
      </button>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--printmd-link-color,#2563eb)]" />
      )}
    </div>
  );
}

export function TabBar() {
  const tabs = useTabsStore((s) => s.tabs);
  const activeTabId = useTabsStore((s) => s.activeTabId);
  const setActiveTab = useTabsStore((s) => s.setActiveTab);
  const removeTab = useTabsStore((s) => s.removeTab);
  const addTab = useTabsStore((s) => s.addTab);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (!scrollRef.current || !activeTabId) return;
    const activeEl = scrollRef.current.querySelector('[aria-selected="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [activeTabId]);

  const handleClose = useCallback(
    (tab: Tab) => {
      if (tab.isDirty) {
        const confirmed = window.confirm('저장하지 않은 변경사항이 있습니다. 닫으시겠습니까?');
        if (!confirmed) return;
      }
      removeTab(tab.id);
    },
    [removeTab],
  );

  const handleNewTab = useCallback(() => {
    addTab();
  }, [addTab]);

  return (
    <div className="hidden md:flex items-center border-b border-[var(--ui-border)] bg-[var(--ui-bg-secondary,var(--ui-bg-hover))] shrink-0">
      {/* Scrollable tab list + new tab button */}
      <div
        ref={scrollRef}
        role="tablist"
        className="flex flex-1 min-w-0 overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => setActiveTab(tab.id)}
            onClose={() => handleClose(tab)}
          />
        ))}

        {/* New tab button — right after the last tab */}
        <button
          onClick={handleNewTab}
          className="shrink-0 px-2 py-1.5 text-[var(--ui-text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--ui-bg-hover)] transition-colors"
          title="New Tab (⌥N / ⌘⌥N)"
          aria-label="New Tab"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
