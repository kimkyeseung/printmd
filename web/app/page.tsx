'use client';

import { useCallback, useRef } from 'react';
import { useEditorStore, useStyleStore, useUIStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { SplitPane } from '@/components/layout/SplitPane';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { StylePanel } from '@/components/style/StylePanel';
import '@/styles/editor.css';
import '@/styles/preview.css';

const DEFAULT_CONTENT = `# Hello printmd

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
`;

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editor store
  const content = useEditorStore((state) => state.content);
  const sourceUrl = useEditorStore((state) => state.sourceUrl);
  const setContent = useEditorStore((state) => state.setContent);

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

  // Initialize content if empty
  const displayContent = content || DEFAULT_CONTENT;

  // Handlers
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, [setContent]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSave = useCallback(() => {
    const blob = new Blob([displayContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [displayContent]);

  const handleLoad = useCallback(() => {
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
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  }, [setContent]);

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
    <div className="flex h-screen flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onStylePanelToggle={toggleStylePanel}
        onPrintClick={handlePrint}
        onSaveClick={handleSave}
        onLoadClick={handleLoad}
      />

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* Style Panel */}
      <StylePanel isOpen={isStylePanelOpen} onClose={closeStylePanel} />
    </div>
  );
}
