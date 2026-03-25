'use client';

import { useState } from 'react';

interface CheatsheetItem {
  name: string;
  nameKo: string;
  markdown: string;
}

interface CheatsheetCategory {
  id: string;
  title: string;
  titleKo: string;
  items: CheatsheetItem[];
}

const categories: CheatsheetCategory[] = [
  {
    id: 'headings',
    title: 'Headings',
    titleKo: '제목',
    items: [
      { name: 'Heading 1', nameKo: '제목 1', markdown: '# Heading 1' },
      { name: 'Heading 2', nameKo: '제목 2', markdown: '## Heading 2' },
      { name: 'Heading 3', nameKo: '제목 3', markdown: '### Heading 3' },
      { name: 'Heading 4', nameKo: '제목 4', markdown: '#### Heading 4' },
      { name: 'Heading 5', nameKo: '제목 5', markdown: '##### Heading 5' },
      { name: 'Heading 6', nameKo: '제목 6', markdown: '###### Heading 6' },
    ],
  },
  {
    id: 'text-formatting',
    title: 'Text Formatting',
    titleKo: '텍스트 서식',
    items: [
      { name: 'Bold', nameKo: '굵게', markdown: '**bold text**' },
      { name: 'Italic', nameKo: '기울임', markdown: '*italic text*' },
      { name: 'Bold & Italic', nameKo: '굵은 기울임', markdown: '***bold and italic***' },
      { name: 'Strikethrough', nameKo: '취소선', markdown: '~~strikethrough~~' },
      { name: 'Inline Code', nameKo: '인라인 코드', markdown: '`inline code`' },
    ],
  },
  {
    id: 'links-images',
    title: 'Links & Images',
    titleKo: '링크 & 이미지',
    items: [
      { name: 'Link', nameKo: '링크', markdown: '[link text](https://example.com)' },
      { name: 'Link with Title', nameKo: '제목 있는 링크', markdown: '[link text](https://example.com "Title")' },
      { name: 'Image', nameKo: '이미지', markdown: '![alt text](https://via.placeholder.com/150)' },
      { name: 'Image with Title', nameKo: '제목 있는 이미지', markdown: '![alt text](https://via.placeholder.com/150 "Image Title")' },
      { name: 'Reference Link', nameKo: '참조 링크', markdown: '[link text][1]\n\n[1]: https://example.com' },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    titleKo: '목록',
    items: [
      {
        name: 'Unordered List',
        nameKo: '순서 없는 목록',
        markdown: '- Item 1\n- Item 2\n- Item 3',
      },
      {
        name: 'Ordered List',
        nameKo: '순서 있는 목록',
        markdown: '1. First\n2. Second\n3. Third',
      },
      {
        name: 'Nested List',
        nameKo: '중첩 목록',
        markdown: '- Item 1\n  - Sub-item A\n  - Sub-item B\n- Item 2',
      },
      {
        name: 'Task List',
        nameKo: '체크리스트',
        markdown: '- [x] Completed task\n- [ ] Incomplete task\n- [ ] Another task',
      },
    ],
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    titleKo: '인용문',
    items: [
      {
        name: 'Blockquote',
        nameKo: '인용문',
        markdown: '> This is a blockquote.',
      },
      {
        name: 'Nested Blockquote',
        nameKo: '중첩 인용문',
        markdown: '> Outer quote\n>> Nested quote\n>>> Deeply nested',
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    titleKo: '코드',
    items: [
      {
        name: 'Inline Code',
        nameKo: '인라인 코드',
        markdown: '`const x = 1;`',
      },
      {
        name: 'Code Block (JavaScript)',
        nameKo: '코드 블록 (JavaScript)',
        markdown: '```javascript\nfunction hello() {\n  console.log("Hello!");\n}\n```',
      },
      {
        name: 'Code Block (Python)',
        nameKo: '코드 블록 (Python)',
        markdown: '```python\ndef hello():\n    print("Hello!")\n```',
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables',
    titleKo: '테이블',
    items: [
      {
        name: 'Basic Table',
        nameKo: '기본 테이블',
        markdown:
          '| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |',
      },
      {
        name: 'Aligned Table',
        nameKo: '정렬 테이블',
        markdown:
          '| Left | Center | Right |\n|:-----|:------:|------:|\n| L    |   C    |     R |\n| L    |   C    |     R |',
      },
    ],
  },
  {
    id: 'horizontal-rules',
    title: 'Horizontal Rules',
    titleKo: '수평선',
    items: [
      { name: 'Hyphens', nameKo: '하이픈', markdown: '---' },
      { name: 'Asterisks', nameKo: '별표', markdown: '***' },
      { name: 'Underscores', nameKo: '밑줄', markdown: '___' },
    ],
  },
  {
    id: 'other',
    title: 'Other',
    titleKo: '기타',
    items: [
      {
        name: 'Escape Characters',
        nameKo: '이스케이프 문자',
        markdown: '\\*not italic\\* \\**not bold\\**',
      },
      {
        name: 'Line Break',
        nameKo: '줄바꿈',
        markdown: 'First line  \nSecond line',
      },
    ],
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
    >
      {copied ? (label === 'Copy' ? 'Copied!' : '복사됨!') : label}
    </button>
  );
}

export function CheatsheetClient({
  locale,
  labels,
}: {
  locale: string;
  labels: {
    copy: string;
    tryInEditor: string;
    source: string;
  };
}) {
  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {locale === 'ko' ? category.titleKo : category.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {category.items.map((item, idx) => (
              <CheatsheetCard
                key={idx}
                item={item}
                locale={locale}
                labels={labels}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CheatsheetCard({
  item,
  locale,
  labels,
}: {
  item: CheatsheetItem;
  locale: string;
  labels: {
    copy: string;
    tryInEditor: string;
    source: string;
  };
}) {
  const editorUrl = `/${locale}?content=${encodeURIComponent(btoa(unescape(encodeURIComponent(item.markdown))))}`;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700">
          {locale === 'ko' ? item.nameKo : item.name}
        </h3>
        <div className="flex gap-2">
          <CopyButton text={item.markdown} label={labels.copy} />
          <a
            href={editorUrl}
            className="rounded border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
          >
            {labels.tryInEditor}
          </a>
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="text-xs font-medium text-gray-400 mb-1">{labels.source}</div>
        <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-sm text-gray-100">
          <code>{item.markdown}</code>
        </pre>
      </div>
    </div>
  );
}
