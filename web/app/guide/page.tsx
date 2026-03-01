import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '마크다운 가이드 - 문법 총정리',
  description:
    '마크다운(Markdown) 문법 완벽 가이드. 제목, 목록, 링크, 이미지, 코드 블록, 테이블 등 모든 문법을 예제와 함께 설명합니다.',
  keywords: [
    '마크다운 문법',
    'markdown guide',
    '마크다운 가이드',
    'markdown syntax',
    '마크다운 사용법',
    '마크다운 튜토리얼',
    'markdown tutorial',
  ],
  openGraph: {
    title: '마크다운 가이드 - 문법 총정리 | printmd',
    description:
      '마크다운(Markdown) 문법 완벽 가이드. 모든 문법을 예제와 함께 설명합니다.',
    url: 'https://printmd.app/guide',
  },
  alternates: {
    canonical: 'https://printmd.app/guide',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '마크다운 가이드 - 문법 총정리',
  description: '마크다운(Markdown) 문법 완벽 가이드. 제목, 목록, 링크, 이미지, 코드 블록, 테이블 등 모든 문법을 예제와 함께 설명합니다.',
  author: {
    '@type': 'Organization',
    name: 'printmd',
    url: 'https://printmd.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'printmd',
    url: 'https://printmd.app',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://printmd.app/guide',
  },
  articleSection: 'Tutorial',
  inLanguage: 'ko-KR',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'printmd',
      item: 'https://printmd.app',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '마크다운 가이드',
      item: 'https://printmd.app/guide',
    },
  ],
};

export default function GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Header */}
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← printmd로 돌아가기
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            마크다운 가이드
          </h1>
          <p className="mt-2 text-gray-600">
            마크다운 문법을 빠르게 익혀보세요
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Table of Contents */}
        <nav className="mb-12 rounded-xl bg-gray-50 p-6">
          <h2 className="font-semibold text-gray-900">목차</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <TocItem href="#headings">제목</TocItem>
            <TocItem href="#emphasis">강조</TocItem>
            <TocItem href="#lists">목록</TocItem>
            <TocItem href="#links">링크</TocItem>
            <TocItem href="#images">이미지</TocItem>
            <TocItem href="#code">코드</TocItem>
            <TocItem href="#blockquotes">인용문</TocItem>
            <TocItem href="#tables">테이블</TocItem>
            <TocItem href="#horizontal-rules">수평선</TocItem>
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-16">
          <SyntaxSection
            id="headings"
            title="제목 (Headings)"
            description="# 기호로 제목을 만들 수 있습니다. 1~6단계까지 지원합니다."
            syntax={`# 제목 1
## 제목 2
### 제목 3
#### 제목 4
##### 제목 5
###### 제목 6`}
          />

          <SyntaxSection
            id="emphasis"
            title="강조 (Emphasis)"
            description="텍스트를 굵게, 기울임, 취소선으로 표시할 수 있습니다."
            syntax={`**굵은 텍스트** 또는 __굵은 텍스트__
*기울임 텍스트* 또는 _기울임 텍스트_
~~취소선 텍스트~~
***굵은 기울임***`}
          />

          <SyntaxSection
            id="lists"
            title="목록 (Lists)"
            description="순서 없는 목록과 순서 있는 목록을 만들 수 있습니다."
            syntax={`순서 없는 목록:
- 항목 1
- 항목 2
  - 중첩 항목
  - 중첩 항목
- 항목 3

순서 있는 목록:
1. 첫 번째
2. 두 번째
3. 세 번째`}
          />

          <SyntaxSection
            id="links"
            title="링크 (Links)"
            description="텍스트에 링크를 추가할 수 있습니다."
            syntax={`[링크 텍스트](https://example.com)
[제목 있는 링크](https://example.com "링크 제목")

URL 자동 링크:
https://example.com`}
          />

          <SyntaxSection
            id="images"
            title="이미지 (Images)"
            description="이미지를 삽입할 수 있습니다."
            syntax={`![대체 텍스트](이미지URL)
![대체 텍스트](이미지URL "이미지 제목")`}
          />

          <SyntaxSection
            id="code"
            title="코드 (Code)"
            description="인라인 코드와 코드 블록을 작성할 수 있습니다."
            syntax={`인라인 코드: \`const x = 1;\`

코드 블록:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\``}
          />

          <SyntaxSection
            id="blockquotes"
            title="인용문 (Blockquotes)"
            description="> 기호로 인용문을 만들 수 있습니다."
            syntax={`> 이것은 인용문입니다.
>
> 여러 줄도 가능합니다.

> 중첩 인용문
>> 더 깊은 인용문`}
          />

          <SyntaxSection
            id="tables"
            title="테이블 (Tables)"
            description="파이프(|)와 하이픈(-)으로 테이블을 만들 수 있습니다."
            syntax={`| 제목 1 | 제목 2 | 제목 3 |
|--------|--------|--------|
| 셀 1   | 셀 2   | 셀 3   |
| 셀 4   | 셀 5   | 셀 6   |

정렬:
| 왼쪽 | 가운데 | 오른쪽 |
|:-----|:------:|-------:|
| L    |   C    |      R |`}
          />

          <SyntaxSection
            id="horizontal-rules"
            title="수평선 (Horizontal Rules)"
            description="세 개 이상의 하이픈, 별표, 밑줄로 수평선을 만들 수 있습니다."
            syntax={`---
***
___`}
          />
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-blue-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            마크다운을 PDF로 변환해보세요
          </h2>
          <p className="mt-2 text-gray-600">
            배운 마크다운 문법을 printmd에서 바로 사용해보세요
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            printmd 시작하기
          </Link>
        </div>
      </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

function TocItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-blue-600 hover:text-blue-700 hover:underline"
      >
        {children}
      </a>
    </li>
  );
}

function SyntaxSection({
  id,
  title,
  description,
  syntax,
}: {
  id: string;
  title: string;
  description: string;
  syntax: string;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
        <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
          마크다운 문법
        </div>
        <pre className="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100">
          <code>{syntax}</code>
        </pre>
      </div>
    </section>
  );
}
