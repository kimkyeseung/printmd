import { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEditorStore, useDocumentsStore } from '@/stores';

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

export function useEditorOrchestrator() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const content = useEditorStore((state) => state.content);
  const sourceUrl = useEditorStore((state) => state.sourceUrl);
  const setContent = useEditorStore((state) => state.setContent);
  const currentDocumentId = useEditorStore((state) => state.currentDocumentId);
  const setCurrentDocumentId = useEditorStore((state) => state.setCurrentDocumentId);
  const updateDocument = useDocumentsStore((state) => state.updateDocument);

  const displayContent = content || DEFAULT_CONTENT[locale] || DEFAULT_CONTENT['en'];

  // Load saved content from localStorage on mount only
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('src')) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
    } else {
      setContent(DEFAULT_CONTENT[locale] || DEFAULT_CONTENT['en']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    localStorage.setItem(STORAGE_KEY, newContent);
  }, [setContent]);

  const handleSave = useCallback(() => {
    if (currentDocumentId) {
      updateDocument(currentDocumentId, displayContent);
      toast.success('저장되었습니다');
      return true; // Saved to existing document
    }
    return false; // Need Save As dialog
  }, [currentDocumentId, displayContent, updateDocument]);

  const handleSaveComplete = useCallback((id: string) => {
    setCurrentDocumentId(id);
    toast.success('저장되었습니다');
  }, [setCurrentDocumentId]);

  const handleLoadFromDialog = useCallback((id: string, loadedContent: string) => {
    setContent(loadedContent);
    setCurrentDocumentId(id);
    toast.success('문서를 불러왔습니다');
  }, [setContent, setCurrentDocumentId]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        setCurrentDocumentId(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [setContent, setCurrentDocumentId]);

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([displayContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [displayContent]);

  return {
    locale,
    content,
    displayContent,
    sourceUrl,
    currentDocumentId,
    handleContentChange,
    handleSave,
    handleSaveComplete,
    handleLoadFromDialog,
    handleFileChange,
    handleDownloadMd,
  };
}
