import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '마크다운 편집기 - 무료 온라인 에디터',
  description:
    '무료 온라인 마크다운 편집기. 실시간 미리보기, 구문 강조, 테마 지원. 설치 없이 브라우저에서 바로 사용. GitHub 스타일 지원.',
  keywords: [
    '마크다운 편집기',
    '마크다운 편집',
    '마크다운 에디터',
    'markdown editor',
    'md 편집기',
    '온라인 마크다운',
    'online markdown editor',
    '무료 마크다운 편집기',
    '실시간 미리보기',
  ],
  openGraph: {
    title: '마크다운 편집기 - 무료 온라인 에디터 | printmd',
    description:
      '무료 온라인 마크다운 편집기. 실시간 미리보기, 구문 강조 지원.',
    url: 'https://printmd.app/markdown-editor',
  },
  alternates: {
    canonical: 'https://printmd.app/markdown-editor',
  },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'printmd - 마크다운 편집기',
  description: '무료 온라인 마크다운 편집기. 실시간 미리보기 지원.',
  url: 'https://printmd.app/markdown-editor',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    '실시간 미리보기',
    '구문 강조',
    '5가지 테마',
    'GitHub 스타일 지원',
    '드래그 앤 드롭',
    'PDF 내보내기',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'printmd 마크다운 편집기는 어떤 기능이 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'printmd는 실시간 미리보기, 50개 이상 언어의 코드 구문 강조, 5가지 테마 프리셋, 커스텀 스타일링, PDF 내보내기 기능을 제공합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '편집한 마크다운을 저장할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, Ctrl+S(또는 Cmd+S)로 .md 파일로 다운로드하거나, Ctrl+P로 PDF로 저장할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '오프라인에서도 사용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'printmd는 PWA(Progressive Web App)를 지원하여, 한 번 방문하면 오프라인에서도 사용할 수 있습니다.',
      },
    },
  ],
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
      name: '마크다운 편집기',
      item: 'https://printmd.app/markdown-editor',
    },
  ],
};

export default function MarkdownEditorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            마크다운 편집기
            <br />
            <span className="text-purple-600">실시간 미리보기</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            설치 없이 브라우저에서 바로 시작하세요.
            <br />
            코드 구문 강조, 테마 선택, PDF 내보내기까지.
          </p>
          <div className="mt-10">
            <Link
              href="/"
              className="rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-purple-700"
            >
              에디터 열기
            </Link>
          </div>
        </header>

        {/* Editor Preview */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-sm text-gray-500">printmd</span>
            </div>
            <div className="grid sm:grid-cols-2">
              <div className="border-r border-gray-200 bg-gray-900 p-4 font-mono text-sm text-gray-300">
                <div className="text-purple-400"># Hello printmd</div>
                <div className="mt-2">마크다운을 **실시간**으로 미리보기</div>
                <div className="mt-2 text-gray-500">```javascript</div>
                <div className="text-green-400">const editor = &apos;awesome&apos;;</div>
                <div className="text-gray-500">```</div>
              </div>
              <div className="bg-white p-4">
                <h1 className="text-2xl font-bold">Hello printmd</h1>
                <p className="mt-2">
                  마크다운을 <strong>실시간</strong>으로 미리보기
                </p>
                <pre className="mt-2 rounded bg-gray-100 p-2 text-sm">
                  <code className="text-purple-600">const</code>{' '}
                  <span className="text-blue-600">editor</span> ={' '}
                  <span className="text-green-600">&apos;awesome&apos;</span>;
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            편집기 기능
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="⚡"
              title="실시간 미리보기"
              description="타이핑하는 즉시 렌더링 결과 확인"
            />
            <Feature
              icon="🎨"
              title="5가지 테마"
              description="GitHub, 노션, 학술, 미니멀, 다크 스타일"
            />
            <Feature
              icon="💡"
              title="구문 강조"
              description="50+ 프로그래밍 언어 코드 하이라이팅"
            />
            <Feature
              icon="📱"
              title="반응형 레이아웃"
              description="에디터만 / 미리보기만 / 분할 뷰"
            />
            <Feature
              icon="⌨️"
              title="키보드 단축키"
              description="Ctrl+S 저장, Ctrl+P 인쇄 등"
            />
            <Feature
              icon="📂"
              title="드래그 앤 드롭"
              description="파일을 끌어다 놓으면 바로 열기"
            />
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              키보드 단축키
            </h2>
            <div className="mt-12 overflow-hidden rounded-xl bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      단축키
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      기능
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <Shortcut keys="Ctrl + S" action="마크다운 파일 저장" />
                  <Shortcut keys="Ctrl + P" action="PDF로 인쇄/저장" />
                  <Shortcut keys="Ctrl + ," action="스타일 패널 열기" />
                  <Shortcut keys="F11" action="전체화면 전환" />
                  <Shortcut keys="Esc" action="패널 닫기" />
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Mac에서는 Ctrl 대신 Cmd 사용
            </p>
          </div>
        </section>

        {/* Supported Syntax */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            지원하는 마크다운 문법
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SyntaxItem>제목 (H1-H6)</SyntaxItem>
            <SyntaxItem>굵게, 기울임, 취소선</SyntaxItem>
            <SyntaxItem>순서 있는/없는 목록</SyntaxItem>
            <SyntaxItem>체크박스 목록</SyntaxItem>
            <SyntaxItem>코드 블록</SyntaxItem>
            <SyntaxItem>인라인 코드</SyntaxItem>
            <SyntaxItem>인용문</SyntaxItem>
            <SyntaxItem>테이블</SyntaxItem>
            <SyntaxItem>링크 & 이미지</SyntaxItem>
            <SyntaxItem>수평선</SyntaxItem>
            <SyntaxItem>HTML 태그</SyntaxItem>
            <SyntaxItem>이모지 :emoji:</SyntaxItem>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/guide"
              className="text-purple-600 underline hover:text-purple-700"
            >
              마크다운 문법 가이드 보기 →
            </Link>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              printmd vs 다른 편집기
            </h2>
            <div className="mt-12 overflow-hidden rounded-xl bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      기능
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-purple-600">
                      printmd
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500">
                      기타
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <CompareRow feature="설치 필요" printmd="❌" others="✅" />
                  <CompareRow feature="회원가입" printmd="❌" others="✅" />
                  <CompareRow feature="실시간 미리보기" printmd="✅" others="✅" />
                  <CompareRow feature="PDF 내보내기" printmd="✅" others="💰" />
                  <CompareRow feature="커스텀 테마" printmd="✅" others="💰" />
                  <CompareRow feature="오프라인 사용" printmd="✅" others="❌" />
                  <CompareRow feature="개인정보 보호" printmd="✅" others="❓" />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            지금 바로 편집해보세요
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            무료 · 설치 불필요 · 회원가입 없음
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-purple-700"
          >
            printmd 에디터 열기
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Shortcut({ keys, action }: { keys: string; action: string }) {
  return (
    <tr>
      <td className="px-6 py-3">
        <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
          {keys}
        </kbd>
      </td>
      <td className="px-6 py-3 text-gray-600">{action}</td>
    </tr>
  );
}

function SyntaxItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
      <span className="text-purple-500">✓</span>
      <span className="text-gray-700">{children}</span>
    </div>
  );
}

function CompareRow({
  feature,
  printmd,
  others,
}: {
  feature: string;
  printmd: string;
  others: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3 text-gray-700">{feature}</td>
      <td className="px-4 py-3 text-center">{printmd}</td>
      <td className="px-4 py-3 text-center">{others}</td>
    </tr>
  );
}
