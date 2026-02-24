'use client';

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-11 items-center justify-between border-b border-[var(--ui-border)] px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">printmd</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]">
            Theme
          </button>
          <button className="rounded px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]">
            Print
          </button>
          <button className="rounded px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]">
            Save
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex w-1/2 flex-col border-r border-[var(--ui-border)]">
          <div className="flex h-10 items-center border-b border-[var(--ui-border)] px-2">
            <span className="text-sm text-[var(--ui-text-muted)]">Editor</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <textarea
              className="h-full w-full resize-none bg-transparent font-mono text-sm outline-none"
              placeholder="마크다운을 입력하세요..."
              defaultValue={`# Hello printmd

마크다운을 어디서든 가져와서 **스타일을 골라** 바로 PDF/인쇄로 뽑는 무료 웹 도구입니다.

## 기능

- 실시간 미리보기
- 5가지 테마 프리셋
- 커스텀 스타일링
- PDF 출력

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`
`}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex w-1/2 flex-col">
          <div className="flex h-10 items-center border-b border-[var(--ui-border)] px-2">
            <span className="text-sm text-[var(--ui-text-muted)]">Preview</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="prose max-w-none">
              <p className="text-[var(--ui-text-muted)]">
                Phase 2에서 마크다운 미리보기가 구현됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
