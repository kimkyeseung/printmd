'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStyleStore, useUIStore, usePrintStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { SplitPane } from '@/components/layout/SplitPane';
import { TabBar } from '@/components/layout/TabBar';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import dynamic from 'next/dynamic';
import { useExtensionReceiver, useKeyboardShortcuts, useFullscreen, useEditorOrchestrator, useDragDrop, useSharedPreset, useSlideMode } from '@/hooks';
import { buildDocumentShareUrl } from '@/lib/share/documentUrl';
import { showToast } from '@/components/ui/Toast';
import { DragDropOverlay } from './DragDropOverlay';
import { CustomFontLoader } from '@/components/style/CustomFontLoader';
import { DocumentSidebar } from '@/components/sidebar/DocumentSidebar';
import '@/styles/editor.css';
import '@/styles/preview.css';
import '@/styles/print.css';

/** Resizable wrapper for the style panel (right side) */
function StylePanelResizer({
  width,
  onWidthChange,
  children,
}: {
  width: number;
  onWidthChange: (w: number) => void;
  children: React.ReactNode;
}) {
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      // Use the flex parent's right edge (excludes ad sidebar etc.)
      const flexParent = containerRef.current.closest('.flex.h-full.w-full');
      const rightEdge = flexParent?.getBoundingClientRect().right ?? window.innerWidth;
      const newWidth = rightEdge - e.clientX;
      onWidthChange(newWidth);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onWidthChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  return (
    <div ref={containerRef} className="flex h-full shrink-0" style={{ width }}>
      {/* Drag handle */}
      <div
        className="relative h-full w-1 cursor-col-resize bg-[var(--ui-border)] hover:bg-[var(--printmd-link-color)] active:bg-[var(--printmd-link-color)]"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>
      {/* Panel content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

const StylePanel = dynamic(() => import('@/components/style/StylePanel'), { ssr: false });
const PrintPreview = dynamic(() => import('@/components/print/PrintPreview'), { ssr: false });
const SaveDialog = dynamic(() => import('@/components/save/SaveDialog'), { ssr: false });
const LoadDialog = dynamic(() => import('@/components/save/LoadDialog'), { ssr: false });
const AdKakaoBanner = dynamic(
  () => import('@/components/adsense/AdKakaoBanner').then((m) => m.AdKakaoBanner),
  { ssr: false },
);
const AdKakaoMobile = dynamic(
  () => import('@/components/adsense/AdKakaoMobile').then((m) => m.AdKakaoMobile),
  { ssr: false },
);
const AdKakaoSidebar = dynamic(
  () => import('@/components/adsense/AdKakaoSidebar').then((m) => m.AdKakaoSidebar),
  { ssr: false },
);
const ExtensionBanner = dynamic(
  () => import('@/components/extension/ExtensionBanner').then((m) => m.ExtensionBanner),
  { ssr: false },
);
const SlideView = dynamic(() => import('@/components/preview/SlideView'), { ssr: false });

export default function HomeClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  // Custom hooks
  useExtensionReceiver();
  useSharedPreset();
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
    handleNewTab,
  } = useEditorOrchestrator();
  const slideMode = useSlideMode(displayContent || '');

  // Store selectors
  const globalStyles = useStyleStore(useShallow((state) => state.globalStyles));
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const isStylePanelOpen = useUIStore((state) => state.isStylePanelOpen);
  const toggleStylePanel = useUIStore((state) => state.toggleStylePanel);
  const closeStylePanel = useUIStore((state) => state.closeStylePanel);
  const editorWidth = useUIStore((state) => state.editorWidth);
  const setEditorWidth = useUIStore((state) => state.setEditorWidth);
  const stylePanelWidth = useUIStore((state) => state.stylePanelWidth);
  const setStylePanelWidth = useUIStore((state) => state.setStylePanelWidth);
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

  const handleShare = useCallback(async () => {
    const content = displayContent || '';
    const result = await buildDocumentShareUrl(content);

    if ('error' in result) {
      if (result.error === 'empty') {
        showToast('Nothing to share - document is empty.', 'info');
      } else if (result.error === 'too_large') {
        showToast('Document is too large to share via URL.', 'error');
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(result.url);
      showToast('Share link copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy link to clipboard.', 'error');
    }
  }, [displayContent]);

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
    onNewTab: handleNewTab,
  });

  // Preview element used in both normal and style-panel modes
  const previewElement = useMemo(
    () => <PreviewPanel markdown={displayContent} styles={globalStyles} sourceUrl={sourceUrl} />,
    [displayContent, globalStyles, sourceUrl],
  );

  // Render content based on view mode and style panel state
  const renderedContent = useMemo(() => {
    if (isStylePanelOpen) {
      // Style panel open — flex layout: Preview(left) + StylePanel(right)
      return (
        <div className="flex h-full w-full">
          <div className="hidden md:flex flex-1 min-w-0 overflow-hidden">
            {previewElement}
          </div>
          {/* Mobile: full width overlay */}
          <div className="flex md:hidden h-full w-full">
            <StylePanel onClose={closeStylePanel} />
          </div>
          {/* Desktop: resizable sidebar */}
          <div className="hidden md:flex">
            <StylePanelResizer
              width={stylePanelWidth}
              onWidthChange={setStylePanelWidth}
            >
              <StylePanel onClose={closeStylePanel} />
            </StylePanelResizer>
          </div>
        </div>
      );
    }

    if (viewMode === 'editor') {
      return <EditorPanel value={displayContent} onChange={handleContentChange} />;
    }
    if (viewMode === 'preview') {
      return previewElement;
    }
    return (
      <SplitPane
        defaultLeftWidth={editorWidth}
        onWidthChange={setEditorWidth}
        left={<EditorPanel value={displayContent} onChange={handleContentChange} />}
        right={previewElement}
      />
    );
  }, [isStylePanelOpen, viewMode, displayContent, handleContentChange, previewElement, editorWidth, setEditorWidth, stylePanelWidth, setStylePanelWidth, closeStylePanel]);

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
        onViewModeChange={(mode) => {
          if (mode !== 'preview' && isStylePanelOpen) closeStylePanel();
          setViewMode(mode);
        }}
        onStylePanelToggle={toggleStylePanel}
        onPrintClick={handlePrint}
        onSaveClick={handleSaveClick}
        onSaveAsClick={handleSaveAs}
        onLoadClick={handleLoad}
        onOpenFileClick={handleOpenFile}
        onDownloadMd={handleDownloadMd}
        onDownloadPdf={handleDownloadPdf}
        onShareClick={handleShare}
        onSlideMode={slideMode.toggleSlideMode}
        hasCurrentDocument={!!currentDocumentId}
        hasSlides={slideMode.hasSlides}
      />

      <TabBar />

      <ExtensionBanner />

      <div className="hidden md:block border-b border-[var(--ui-border)] h-[90px] shrink-0 overflow-hidden">
        <AdKakaoBanner className="h-[90px] max-w-[728px] mx-auto flex items-center justify-center" />
      </div>

      <div className="flex flex-1 min-h-0">
        <DocumentSidebar />
        <main id="main-content" className="relative flex-1 overflow-hidden" role="main">
          {renderedContent}
        </main>
        <aside className="hidden xl:flex flex-col w-[160px] shrink-0 border-l border-[var(--ui-border)]">
          <AdKakaoSidebar className="sticky top-0 w-[160px] h-[600px]" />
        </aside>
      </div>

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

      {slideMode.isSlideMode && (
        <SlideView
          slides={slideMode.slides}
          currentSlide={slideMode.currentSlide}
          totalSlides={slideMode.totalSlides}
          styles={globalStyles}
          onNext={slideMode.nextSlide}
          onPrev={slideMode.prevSlide}
          onExit={slideMode.exitSlideMode}
          onGoToSlide={slideMode.goToSlide}
        />
      )}

      {isDragging && <DragDropOverlay />}
      <CustomFontLoader />
    </div>
  );
}
