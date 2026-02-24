import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onPrint?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onToggleStylePanel?: () => void;
  onToggleFullscreen?: () => void;
  onEscape?: () => void;
}

/**
 * Hook for global keyboard shortcuts
 *
 * Shortcuts:
 * - Ctrl/Cmd + S: Save
 * - Ctrl/Cmd + P: Print
 * - Ctrl/Cmd + B: Bold (when in editor)
 * - Ctrl/Cmd + I: Italic (when in editor)
 * - Ctrl/Cmd + Shift + S: Toggle style panel
 * - F11 / Ctrl/Cmd + Shift + F: Toggle fullscreen
 * - Escape: Exit fullscreen / Close modals
 */
export function useKeyboardShortcuts(options: KeyboardShortcutsOptions) {
  const {
    onSave,
    onPrint,
    onBold,
    onItalic,
    onToggleStylePanel,
    onToggleFullscreen,
    onEscape,
  } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
        return;
      }

      // F11 - Fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault();
        onToggleFullscreen?.();
        return;
      }

      if (!modKey) return;

      // Ctrl/Cmd + Shift combinations
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            onToggleStylePanel?.();
            break;
          case 'f':
            e.preventDefault();
            onToggleFullscreen?.();
            break;
        }
        return;
      }

      // Ctrl/Cmd combinations (without Shift)
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          onSave?.();
          break;
        case 'p':
          e.preventDefault();
          onPrint?.();
          break;
        case 'b':
          // Only prevent default if handler exists and we're in editor
          if (onBold && isInEditor()) {
            e.preventDefault();
            onBold();
          }
          break;
        case 'i':
          if (onItalic && isInEditor()) {
            e.preventDefault();
            onItalic();
          }
          break;
      }
    },
    [onSave, onPrint, onBold, onItalic, onToggleStylePanel, onToggleFullscreen, onEscape]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Check if focus is in the editor area
 */
function isInEditor(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  // Check if we're in CodeMirror editor
  return (
    activeElement.closest('.cm-editor') !== null ||
    activeElement.classList.contains('cm-content')
  );
}

/**
 * Hook for fullscreen management
 */
export function useFullscreen() {
  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  const isFullscreen = useCallback(() => {
    return document.fullscreenElement !== null;
  }, []);

  return {
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isFullscreen,
  };
}
