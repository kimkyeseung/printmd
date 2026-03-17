'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStyleStore, useUIStore, usePrintStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { SplitPane } from '@/components/layout/SplitPane';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import dynamic from 'next/dynamic';
import { AdKakaoBanner } from '@/components/adsense/AdKakaoBanner';
import { AdKakaoMobile } from '@/components/adsense/AdKakaoMobile';
import { AdKakaoSidebar } from '@/components/adsense/AdKakaoSidebar';
import { useExtensionReceiver, useKeyboardShortcuts, useFullscreen, useEditorOrchestrator, useDragDrop } from '@/hooks';
import { DragDropOverlay } from './DragDropOverlay';
import '@/styles/editor.css';
import '@/styles/preview.css';
import '@/styles/print.css';

const StylePanel = dynamic(() => import('@/components/style/StylePanel'), { ssr: false });
const PrintPreview = dynamic(() => import('@/components/print/PrintPreview'), { ssr: false });
const SaveDialog = dynamic(() => import('@/components/save/SaveDialog'), { ssr: false });
const LoadDialog = dynamic(() => import('@/components/save/LoadDialog'), { ssr: false });
const ExtensionBanner = dynamic(
  () => import('@/components/extension/ExtensionBanner').then((m) => m.ExtensionBanner),
  { ssr: false },
);

export default function HomeClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  // Custom hooks
  useExtensionReceiver();
  const { toggleFullscreen } = useFullscreen();
  const { isDragging } = useDragDrop();
  const {
    displayContent,
    sourceUrl,
    currentDocumentId,
    handleContentChange,
    handleSave,
    handleSaveComplete,
    handleLoadFromDialog,
    handleFileChange,
    handleDownloadMd,
  } = useEditorOrchestrator();

  // Store selectors
  const globalStyles = useStyleStore(useShallow((state) => state.globalStyles));
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const isStylePanelOpen = useUIStore((state) => state.isStylePanelOpen);
  const toggleStylePanel = useUIStore((state) => state.toggleStylePanel);
  const closeStylePanel = useUIStore((state) => state.closeStylePanel);
  const editorWidth = useUIStore((state) => state.editorWidth);
  const setEditorWidth = useUIStore((state) => state.setEditorWidth);
  const isPrintPreviewOpen = usePrintStore((state) => state.isPreviewOpen);
  const openPrintPreview = usePrintStore((state) => state.openPreview);
  const closePrintPreview = usePrintStore((state) => state.closePreview);

  // On mobile, switch from split to editor view
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    if (mql.matches && viewMode === 'split') {
      setViewMode('editor');
    }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches && viewMode === 'split') {
        setViewMode('editor');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Action handlers
  const handlePrint = useCallback(() => openPrintPreview(), [openPrintPreview]);

  const handleSaveClick = useCallback(() => {
    const saved = handleSave();
    if (!saved) setIsSaveDialogOpen(true);
  }, [handleSave]);

  const handleSaveAs = useCallback(() => setIsSaveDialogOpen(true), []);
  const handleLoad = useCallback(() => setIsLoadDialogOpen(true), []);
  const handleOpenFile = useCallback(() => fileInputRef.current?.click(), []);
  const handleDownloadPdf = useCallback(() => openPrintPreview(), [openPrintPreview]);

  // Keyboard shortcuts
  const handleEscape = useCallback(() => {
    if (isSaveDialogOpen) setIsSaveDialogOpen(false);
    else if (isLoadDialogOpen) setIsLoadDialogOpen(false);
    else if (isPrintPreviewOpen) closePrintPreview();
    else if (isStylePanelOpen) closeStylePanel();
  }, [isSaveDialogOpen, isLoadDialogOpen, isPrintPreviewOpen, isStylePanelOpen, closePrintPreview, closeStylePanel]);

  useKeyboardShortcuts({
    onSave: handleSaveClick,
    onPrint: handlePrint,
    onToggleStylePanel: toggleStylePanel,
    onToggleFullscreen: toggleFullscreen,
    onEscape: handleEscape,
  });

  // Render content based on view mode
  const renderContent = () => {
    if (viewMode === 'editor') {
      return <EditorPanel value={displayContent} onChange={handleContentChange} />;
    }
    if (viewMode === 'preview') {
      return <PreviewPanel markdown={displayContent} styles={globalStyles} sourceUrl={sourceUrl} />;
    }
    return (
      <SplitPane
        defaultLeftWidth={editorWidth}
        onWidthChange={setEditorWidth}
        left={<EditorPanel value={displayContent} onChange={handleContentChange} />}
        right={<PreviewPanel markdown={displayContent} styles={globalStyles} sourceUrl={sourceUrl} />}
      />
    );
  };

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden pb-[50px] md:pb-0">
      <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        className="hidden"
        onChange={handleFileChange}
        aria-label="마크다운 파일 선택"
      />

      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onStylePanelToggle={toggleStylePanel}
        onPrintClick={handlePrint}
        onSaveClick={handleSaveClick}
        onSaveAsClick={handleSaveAs}
        onLoadClick={handleLoad}
        onOpenFileClick={handleOpenFile}
        onDownloadMd={handleDownloadMd}
        onDownloadPdf={handleDownloadPdf}
        hasCurrentDocument={!!currentDocumentId}
      />

      <ExtensionBanner />

      <div className="hidden md:block border-b border-[var(--ui-border)] h-[90px] flex-shrink-0 overflow-hidden">
        <AdKakaoBanner className="h-[90px] max-w-[728px] mx-auto flex items-center justify-center" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <main id="main-content" className="flex-1 overflow-hidden" role="main">
          {renderContent()}
        </main>
        <aside className="hidden xl:flex flex-col w-[160px] flex-shrink-0 border-l border-[var(--ui-border)]">
          <AdKakaoSidebar className="sticky top-0 w-[160px] h-[600px]" />
        </aside>
      </div>

      {isStylePanelOpen && <StylePanel isOpen={isStylePanelOpen} onClose={closeStylePanel} />}
      {isPrintPreviewOpen && <PrintPreview isOpen={isPrintPreviewOpen} onClose={closePrintPreview} content={displayContent} />}
      {isSaveDialogOpen && (
        <SaveDialog
          isOpen={isSaveDialogOpen}
          content={displayContent}
          onClose={() => setIsSaveDialogOpen(false)}
          onSave={handleSaveComplete}
        />
      )}
      {isLoadDialogOpen && (
        <LoadDialog
          isOpen={isLoadDialogOpen}
          onClose={() => setIsLoadDialogOpen(false)}
          onLoad={handleLoadFromDialog}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--background)] border-t border-[var(--ui-border)] h-[50px] overflow-hidden">
        <AdKakaoMobile className="h-[50px] flex items-center justify-center" />
      </div>

      {isDragging && <DragDropOverlay />}
    </div>
  );
}
