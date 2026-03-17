'use client';

import { useState } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { ElementStyleEditor } from './ElementStyleEditor';
import { FontManager } from './FontManager';
import { useStyleStore } from '@/stores';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'preset' | 'edit' | 'font';

export function StylePanel({ isOpen, onClose }: StylePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preset');

  const currentTheme = useStyleStore((state) => state.currentTheme);
  const setTheme = useStyleStore((state) => state.setTheme);
  const resetToDefault = useStyleStore((state) => state.resetToDefault);
  const customThemes = useStyleStore((state) => state.customThemes);
  const saveCustomTheme = useStyleStore((state) => state.saveCustomTheme);
  const loadCustomTheme = useStyleStore((state) => state.loadCustomTheme);
  const deleteCustomTheme = useStyleStore((state) => state.deleteCustomTheme);

  if (!isOpen) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'preset', label: 'Preset' },
    { key: 'edit', label: 'Edit' },
    { key: 'font', label: 'Font' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-[var(--ui-border)] bg-[var(--background)] shadow-lg sm:w-80"
        role="dialog"
        aria-modal="true"
        aria-labelledby="style-panel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-4 py-3">
          <h2 id="style-panel-title" className="font-medium">Style Settings</h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--ui-bg-hover)]"
            aria-label="스타일 패널 닫기"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--ui-border)]" role="tablist" aria-label="스타일 설정 탭">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-3 py-2 text-sm ${
                activeTab === key
                  ? 'border-b-2 border-[var(--printmd-link-color)] font-medium'
                  : 'text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)]'
              }`}
              role="tab"
              aria-selected={activeTab === key}
              aria-controls={`tabpanel-${key}`}
              id={`tab-${key}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'preset' && (
            <ThemeSelector
              currentTheme={currentTheme}
              onSelect={setTheme}
              customThemes={customThemes}
              onLoadCustom={loadCustomTheme}
              onDeleteCustom={deleteCustomTheme}
              onSaveCustom={saveCustomTheme}
            />
          )}

          {activeTab === 'edit' && (
            <ElementStyleEditor />
          )}

          {activeTab === 'font' && (
            <FontManager />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-[var(--ui-border)] p-4">
          <button
            onClick={resetToDefault}
            className="flex-1 rounded border border-[var(--ui-border)] px-3 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)]"
          >
            Done
          </button>
        </div>
      </aside>
    </>
  );
}

export default StylePanel;
