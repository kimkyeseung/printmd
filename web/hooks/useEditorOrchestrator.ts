import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEditorStore, useDocumentsStore } from '@/stores';

const STORAGE_KEY = 'printmd-content';
const SAVE_DEBOUNCE_MS = 500;

const DEFAULT_CONTENT: Record<string, string> = {
  ko: `# printmd

**마크다운을 가장 예쁜 PDF로 만드는 가장 쉬운 방법.**

무료, 회원가입 없이, 브라우저에서 바로.

---

## 주요 기능

- **실시간 미리보기** — 편집하면서 결과를 바로 확인
- **5가지 테마 프리셋** — 클릭 한 번으로 분위기 전환
- **커스텀 스타일링** — 폰트, 색상, 여백까지 세밀하게 조절
- **인라인 편집** — 미리보기에서 더블클릭으로 바로 수정
- **PDF 출력** — 완성된 문서를 그대로 PDF로 저장

## 시작하기

1. 마크다운을 직접 작성하거나 파일을 드래그하세요
2. 오른쪽 미리보기에서 결과를 실시간으로 확인하세요
3. 테마를 골라 스타일을 입히세요
4. **PDF로 저장**하거나 바로 **인쇄**하세요

## 텍스트 서식

마크다운은 다양한 **텍스트 서식**을 지원합니다:

- **굵게** — 강조하고 싶은 텍스트
- *기울임* — 부드러운 강조
- ~~취소선~~ — 삭제된 내용 표시
- \`인라인 코드\` — 코드나 명령어를 본문 안에 표시
- **굵게 + *기울임*** — 조합도 가능합니다

링크도 간단합니다: [printmd 홈페이지](https://printmd.app)

## 체크리스트

- [x] 마크다운 에디터 열기
- [x] 테마 선택하기
- [ ] 커스텀 스타일 적용하기
- [ ] PDF로 내보내기

## 코드 블록

\`\`\`javascript
// printmd에서 코드 블록을 테스트해 보세요
function greet(name) {
  return \\\`Hello, \\\${name}! Welcome to printmd.\\\`;
}

console.log(greet('World'));
\`\`\`

\`\`\`python
# Python도 지원합니다
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
\`\`\`

## 테이블

| 기능 | 설명 | 단축키 |
|------|------|--------|
| 에디터 | CodeMirror 6 기반 마크다운 편집기 | — |
| 미리보기 | 실시간 렌더링 + 인라인 편집 | 더블클릭 |
| 테마 | 5가지 프리셋 + 커스텀 스타일 | — |
| 저장 | 문서 저장 | \`Ctrl/⌘ + S\` |
| 출력 | PDF 저장 및 인쇄 | \`Ctrl/⌘ + P\` |

## 중첩 리스트

- 마크다운 문법
  - 블록 요소
    - 제목 (h1~h6)
    - 문단
    - 인용문
    - 코드 블록
  - 인라인 요소
    - 굵게, 기울임
    - 링크, 이미지
    - 인라인 코드

### 순서 있는 중첩 리스트

1. 문서 작성
   1. 마크다운 문법으로 내용 작성
   2. 실시간 미리보기로 확인
2. 스타일 적용
   1. 테마 프리셋 선택
   2. 필요시 커스텀 스타일 조정
3. 출력
   1. PDF로 저장
   2. 또는 바로 인쇄

### 제목 단계

아래는 h3 \~ h6 제목의 예시입니다:

#### h4 네 번째 단계 제목

##### h5 다섯 번째 단계 제목

###### h6 여섯 번째 단계 제목

## 인용문

> 마크다운을 쓰세요. 스타일은 printmd가 입힙니다.

> **팁:** 미리보기에서 아무 블록이나 더블클릭하면
> 해당 블록의 마크다운을 바로 수정할 수 있습니다.
> 수정 후 \`Ctrl/⌘ + Enter\`로 확정, \`Escape\`로 취소하세요.

## 이미지

![Markdown Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/208px-Markdown-mark.svg.png)

---

*지금 바로 마크다운을 붙여넣거나 파일을 드래그해서 시작하세요.*
`,
  en: `# printmd

**The easiest way to turn Markdown into beautifully styled PDFs.**

Free. No signup. Right in your browser.

---

## Key Features

- **Live Preview** — See changes as you type
- **5 Theme Presets** — Switch styles with a single click
- **Custom Styling** — Fine-tune fonts, colors, spacing, and more
- **Inline Editing** — Double-click any block in the preview to edit
- **PDF Export** — Save your polished document as a PDF

## Getting Started

1. Write Markdown directly or drag and drop a file
2. Check the live preview on the right
3. Pick a theme to style your document
4. **Save as PDF** or **print** directly

## Text Formatting

Markdown supports a variety of **text formatting** options:

- **Bold** — Emphasize important text
- *Italic* — Subtle emphasis
- ~~Strikethrough~~ — Mark deleted content
- \`Inline code\` — Display code or commands within text
- **Bold + *italic*** — Combine them freely

Links are simple too: [printmd homepage](https://printmd.app)

## Checklist

- [x] Open the Markdown editor
- [x] Choose a theme
- [ ] Apply custom styles
- [ ] Export to PDF

## Code Blocks

\`\`\`javascript
// Try a code block in printmd
function greet(name) {
  return \\\`Hello, \\\${name}! Welcome to printmd.\\\`;
}

console.log(greet('World'));
\`\`\`

\`\`\`python
# Python is supported too
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
\`\`\`

## Table

| Feature | Description | Shortcut |
|---------|-------------|----------|
| Editor | CodeMirror 6 markdown editor | — |
| Preview | Live rendering + inline editing | Double-click |
| Themes | 5 presets + custom styling | — |
| Save | Save document | \`Ctrl/⌘ + S\` |
| Export | PDF save and print | \`Ctrl/⌘ + P\` |

## Nested Lists

- Markdown syntax
  - Block elements
    - Headings (h1–h6)
    - Paragraphs
    - Blockquotes
    - Code blocks
  - Inline elements
    - Bold, italic
    - Links, images
    - Inline code

### Ordered Nested List

1. Write your document
   1. Author content in Markdown
   2. Check the live preview
2. Apply styles
   1. Choose a theme preset
   2. Adjust custom styles if needed
3. Export
   1. Save as PDF
   2. Or print directly

### Heading Levels

Below are examples of h3 through h6 headings:

#### h4 Fourth-Level Heading

##### h5 Fifth-Level Heading

###### h6 Sixth-Level Heading

## Blockquotes

> Write Markdown. Let printmd handle the styling.

> **Tip:** Double-click any block in the preview
> to edit its Markdown source inline.
> Press \`Ctrl/⌘ + Enter\` to confirm, \`Escape\` to cancel.

## Image

![Markdown Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/208px-Markdown-mark.svg.png)

---

*Paste your Markdown or drag a file to get started.*
`,
};

export function useEditorOrchestrator() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, newContent);
      } catch {
        // localStorage quota exceeded - silently ignore
      }
    }, SAVE_DEBOUNCE_MS);
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
