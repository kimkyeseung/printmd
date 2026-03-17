'use client';

import { useState, useSyncExternalStore } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { ElementStyleEditor } from './ElementStyleEditor';
import { FontManager } from './FontManager';
import { useStyleStore } from '@/stores';

interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'preset' | 'edit' | 'font';

function useTemporalCanUndoRedo() {
  const temporal = useStyleStore.temporal;
  const canUndo = useSyncExternalStore(
    temporal.subscribe,
    () => temporal.getState().pastStates.length > 0,
    () => false,
  );
  const canRedo = useSyncExternalStore(
    temporal.subscribe,
    () => temporal.getState().futureStates.length > 0,
    () => false,
  );
  return { canUndo, canRedo };
}

export function StylePanel({ isOpen, onClose }: StylePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preset');

  const currentTheme = useStyleStore((state) => state.currentTheme);
  const setTheme = useStyleStore((state) => state.setTheme);
  const resetToDefault = useStyleStore((state) => state.resetToDefault);
  const customThemes = useStyleStore((state) => state.customThemes);
  const saveCustomTheme = useStyleStore((state) => state.saveCustomTheme);
  const loadCustomTheme = useStyleStore((state) => state.loadCustomTheme);
  const deleteCustomTheme = useStyleStore((state) => state.deleteCustomTheme);
  const renameCustomTheme = useStyleStore((state) => state.renameCustomTheme);
  const importCustomTheme = useStyleStore((state) => state.importCustomTheme);
  const elementStyles = useStyleStore((state) => state.elementStyles);

  const { canUndo, canRedo } = useTemporalCanUndoRedo();
  const undo = () => useStyleStore.temporal.getState().undo();
  const redo = () => useStyleStore.temporal.getState().redo();

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
            aria-label="Close style panel"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--ui-border)]" role="tablist" aria-label="Style settings tabs">
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
              onRenameCustom={renameCustomTheme}
              onImportCustom={importCustomTheme}
              elementStyles={elementStyles}
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
            onClick={() => undo()}
            disabled={!canUndo}
            className="rounded border border-[var(--ui-border)] px-2 py-2 text-sm hover:bg-[var(--ui-bg-hover)] disabled:opacity-30"
            aria-label="Undo"
            title="Undo"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </button>
          <button
            onClick={() => redo()}
            disabled={!canRedo}
            className="rounded border border-[var(--ui-border)] px-2 py-2 text-sm hover:bg-[var(--ui-bg-hover)] disabled:opacity-30"
            aria-label="Redo"
            title="Redo"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
            </svg>
          </button>
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
