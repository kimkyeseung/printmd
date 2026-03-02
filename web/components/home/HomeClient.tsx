'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEditorStore, useStyleStore, useUIStore, usePrintStore, useDocumentsStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { SplitPane } from '@/components/layout/SplitPane';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { StylePanel } from '@/components/style/StylePanel';
import { PrintPreview } from '@/components/print/PrintPreview';
import { SaveDialog, LoadDialog } from '@/components/save';
import { AdBanner } from '@/components/adsense/AdBanner';
import { AdMobile } from '@/components/adsense/AdMobile';
import { createDragDropHandler, type FileInfo } from '@/lib/file';
import { useExtensionReceiver, useKeyboardShortcuts, useFullscreen } from '@/hooks';
import '@/styles/editor.css';
import '@/styles/preview.css';
import '@/styles/print.css';

const STORAGE_KEY = 'printmd-content';

const DEFAULT_CONTENT: Record<string, string> = {
  ko: `# Hello printmd

마크다운을 어디서든 가져와서 **스타일을 골라** 바로 PDF/인쇄로 뽑는 무료 웹 도구입니다.

## 기능

- 실시간 미리보기
- 5가지 테마 프리셋
- 커스텀 스타일링
- PDF 출력

## 코드 블록

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

## 테이블

| 기능 | 설명 |
|------|------|
| Editor | CodeMirror 6 기반 |
| Preview | markdown-it 렌더링 |
| Theme | 5가지 프리셋 |

## 인용

> 마크다운을 예쁘게 인쇄하세요!

---

*printmd로 만들었습니다.*

---

**Made by** [kimkyeseung](mailto:kimkyeseung@gmail.com)
`,
  en: `# Hello printmd

A free web tool to **style and print** your Markdown as PDF instantly.

## Features

- Real-time preview
- 5 theme presets
- Custom styling
- PDF export

## Code Block

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

## Table

| Feature | Description |
|---------|-------------|
| Editor | CodeMirror 6 based |
| Preview | markdown-it rendering |
| Theme | 5 presets available |

## Blockquote

> Print your Markdown beautifully!

---

*Made with printmd.*

---

**Made by** [kimkyeseung](mailto:kimkyeseung@gmail.com)
`,
};

export default function HomeClient() {
  const params = useParams();
  const locale = (params.locale as string) || 'ko';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  // Extension receiver (handles ?src= URL param)
  useExtensionReceiver();

  // Fullscreen management
  const { toggleFullscreen } = useFullscreen();

  // Editor store
  const content = useEditorStore((state) => state.content);
  const sourceUrl = useEditorStore((state) => state.sourceUrl);
  const setContent = useEditorStore((state) => state.setContent);
  const currentDocumentId = useEditorStore((state) => state.currentDocumentId);
  const setCurrentDocumentId = useEditorStore((state) => state.setCurrentDocumentId);

  // Documents store
  const updateDocument = useDocumentsStore((state) => state.updateDocument);

  // Style store
  const globalStyles = useStyleStore((state) => state.globalStyles);

  // UI store
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const isStylePanelOpen = useUIStore((state) => state.isStylePanelOpen);
  const toggleStylePanel = useUIStore((state) => state.toggleStylePanel);
  const closeStylePanel = useUIStore((state) => state.closeStylePanel);
  const editorWidth = useUIStore((state) => state.editorWidth);
  const setEditorWidth = useUIStore((state) => state.setEditorWidth);

  // Print store
  const isPrintPreviewOpen = usePrintStore((state) => state.isPreviewOpen);
  const openPrintPreview = usePrintStore((state) => state.openPreview);
  const closePrintPreview = usePrintStore((state) => state.closePreview);

  // Initialize content if empty
  const displayContent = content || DEFAULT_CONTENT[locale] || DEFAULT_CONTENT['ko'];

  // Load saved content from localStorage on mount only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('src')) return; // Let extension receiver handle URL content
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, [setContent]);

  const handlePrint = useCallback(() => {
    openPrintPreview();
  }, [openPrintPreview]);

  const handleSave = useCallback(() => {
    if (currentDocumentId) {
      // Update existing document
      updateDocument(currentDocumentId, displayContent);
      toast.success('저장되었습니다');
    } else {
      // No current document, open Save As dialog
      setIsSaveDialogOpen(true);
    }
  }, [currentDocumentId, displayContent, updateDocument]);

  const handleSaveAs = useCallback(() => {
    setIsSaveDialogOpen(true);
  }, []);

  const handleSaveComplete = useCallback((id: string) => {
    setCurrentDocumentId(id);
    toast.success('저장되었습니다');
  }, [setCurrentDocumentId]);

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([displayContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [displayContent]);

  const handleDownloadPdf = useCallback(() => {
    openPrintPreview();
  }, [openPrintPreview]);

  const handleLoad = useCallback(() => {
    setIsLoadDialogOpen(true);
  }, []);

  const handleLoadFromDialog = useCallback((id: string, content: string) => {
    setContent(content);
    setCurrentDocumentId(id);
    toast.success('문서를 불러왔습니다');
  }, [setContent, setCurrentDocumentId]);

  const handleOpenFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        setCurrentDocumentId(null); // Reset current document when loading from file
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  }, [setContent, setCurrentDocumentId]);

  // Drag and drop handlers
  const handleFileDrop = useCallback((file: FileInfo) => {
    setContent(file.content);
  }, [setContent]);

  const dragDropHandlers = useMemo(() => createDragDropHandler({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: handleFileDrop,
    onError: (error) => console.error('Drop error:', error),
  }), [handleFileDrop]);

  // Keyboard shortcuts
  const handleEscape = useCallback(() => {
    if (isSaveDialogOpen) {
      setIsSaveDialogOpen(false);
    } else if (isLoadDialogOpen) {
      setIsLoadDialogOpen(false);
    } else if (isPrintPreviewOpen) {
      closePrintPreview();
    } else if (isStylePanelOpen) {
      closeStylePanel();
    }
  }, [isSaveDialogOpen, isLoadDialogOpen, isPrintPreviewOpen, isStylePanelOpen, closePrintPreview, closeStylePanel]);

  useKeyboardShortcuts({
    onSave: handleSave,
    onPrint: handlePrint,
    onToggleStylePanel: toggleStylePanel,
    onToggleFullscreen: toggleFullscreen,
    onEscape: handleEscape,
  });

  // Setup global drag-drop
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => dragDropHandlers.handleDragEnter(e);
    const handleDragLeave = (e: DragEvent) => dragDropHandlers.handleDragLeave(e);
    const handleDragOver = (e: DragEvent) => dragDropHandlers.handleDragOver(e);
    const handleDrop = (e: DragEvent) => dragDropHandlers.handleDrop(e);

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [dragDropHandlers]);

  // Render content based on view mode
  const renderContent = () => {
    if (viewMode === 'editor') {
      return (
        <EditorPanel
          value={displayContent}
          onChange={handleContentChange}
        />
      );
    }

    if (viewMode === 'preview') {
      return (
        <PreviewPanel
          markdown={displayContent}
          styles={globalStyles}
          sourceUrl={sourceUrl}
        />
      );
    }

    // Split view (default)
    return (
      <SplitPane
        defaultLeftWidth={editorWidth}
        onWidthChange={setEditorWidth}
        left={
          <EditorPanel
            value={displayContent}
            onChange={handleContentChange}
          />
        }
        right={
          <PreviewPanel
            markdown={displayContent}
            styles={globalStyles}
            sourceUrl={sourceUrl}
          />
        }
      />
    );
  };

  return (
    <div className="flex h-screen flex-col pb-[50px] md:pb-0">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        className="hidden"
        onChange={handleFileChange}
        aria-label="마크다운 파일 선택"
      />

      {/* Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onStylePanelToggle={toggleStylePanel}
        onPrintClick={handlePrint}
        onSaveClick={handleSave}
        onSaveAsClick={handleSaveAs}
        onLoadClick={handleLoad}
        onOpenFileClick={handleOpenFile}
        onDownloadMd={handleDownloadMd}
        onDownloadPdf={handleDownloadPdf}
        hasCurrentDocument={!!currentDocumentId}
      />

      {/* Ad Banner - Desktop only */}
      <div className="hidden md:block border-b border-[var(--ui-border)]">
        <AdBanner
          className="h-[90px] max-w-[728px] mx-auto"
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
        />
      </div>

      {/* Main content */}
      <main id="main-content" className="flex-1 overflow-hidden" role="main">
        {renderContent()}
      </main>

      {/* Style Panel */}
      <StylePanel isOpen={isStylePanelOpen} onClose={closeStylePanel} />

      {/* Print Preview */}
      <PrintPreview isOpen={isPrintPreviewOpen} onClose={closePrintPreview} />

      {/* Save Dialog */}
      <SaveDialog
        isOpen={isSaveDialogOpen}
        content={displayContent}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveComplete}
      />

      {/* Load Dialog */}
      <LoadDialog
        isOpen={isLoadDialogOpen}
        onClose={() => setIsLoadDialogOpen(false)}
        onLoad={handleLoadFromDialog}
      />

      {/* Mobile Ad - Fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-[var(--ui-border)]">
        <AdMobile
          className="h-[50px]"
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE}
        />
      </div>

      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="파일 드롭 영역"
        >
          <div className="rounded-2xl border-4 border-dashed border-blue-500 bg-white/90 p-8 text-center shadow-2xl sm:p-12">
            <svg
              className="mx-auto h-12 w-12 text-blue-500 sm:h-16 sm:w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-700 sm:text-xl">
              마크다운 파일을 여기에 놓으세요
            </p>
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              .md, .markdown, .txt 파일 지원
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
