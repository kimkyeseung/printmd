import { useCallback, useEffect } from 'react';
import { usePrintStore } from '@/stores';
import { generatePrintStyles } from '@/lib/print/printStyles';

export function usePrint() {
  const settings = usePrintStore((state) => state.settings);
  const isPreviewOpen = usePrintStore((state) => state.isPreviewOpen);
  const openPreview = usePrintStore((state) => state.openPreview);
  const closePreview = usePrintStore((state) => state.closePreview);

  // Inject print styles when printing
  useEffect(() => {
    const styleId = 'printmd-print-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = generatePrintStyles(settings);

    return () => {
      // Don't remove on cleanup - keep for printing
    };
  }, [settings]);

  // Handle keyboard shortcut (Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        openPreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPreview]);

  const print = useCallback(() => {
    window.print();
  }, []);

  return {
    settings,
    isPreviewOpen,
    openPreview,
    closePreview,
    print,
  };
}
