import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '마크다운 프린트 - 무료 인쇄 도구',
  description:
    '마크다운 파일을 예쁘게 프린트하세요. 코드 구문 강조, 테이블, 이미지까지 완벽 지원. 5가지 테마로 깔끔하게 인쇄. 무료, 가입 불필요.',
  keywords: [
    '마크다운 프린트',
    '마크다운 인쇄',
    'markdown print',
    'md 프린트',
    'md 인쇄',
    '마크다운 출력',
    'print markdown',
    'README 인쇄',
    '문서 인쇄',
  ],
  openGraph: {
    title: '마크다운 프린트 - 무료 인쇄 도구 | printmd',
    description:
      '마크다운 파일을 예쁘게 프린트. 코드 구문 강조, 테이블 완벽 지원.',
    url: 'https://printmd.app/markdown-print',
  },
  alternates: {
    canonical: 'https://printmd.app/markdown-print',
  },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'printmd - 마크다운 프린트',
  description: '마크다운 파일을 예쁘게 인쇄하는 무료 온라인 도구',
  url: 'https://printmd.app/markdown-print',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '마크다운 파일을 어떻게 프린트하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'printmd에서 마크다운 파일을 드래그 앤 드롭하고, 테마를 선택한 후 Ctrl+P(또는 Cmd+P)를 누르면 바로 인쇄할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '코드 블록도 예쁘게 인쇄되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, printmd는 50개 이상의 프로그래밍 언어에 대한 구문 강조(Syntax Highlighting)를 지원합니다. 코드 블록이 컬러로 예쁘게 인쇄됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'GitHub README도 인쇄할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, printmd Chrome 확장 프로그램을 설치하면 GitHub에서 버튼 한 번으로 README를 인쇄할 수 있습니다.',
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
      name: '마크다운 프린트',
      item: 'https://printmd.app/markdown-print',
    },
  ],
};

export default function MarkdownPrintPage() {
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            마크다운
            <br />
            <span className="text-green-600">예쁘게 프린트</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            README, 기술 문서, 노트를 깔끔하게 인쇄하세요.
            <br />
            코드 구문 강조, 테이블, 이미지까지 완벽 지원.
          </p>
          <div className="mt-10">
            <Link
              href="/"
              className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700"
            >
              무료로 프린트하기
            </Link>
          </div>
        </header>

        {/* Print Flow */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            3단계로 간단하게
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step number={1} title="파일 열기" description="드래그 앤 드롭 또는 파일 선택" />
            <Step number={2} title="테마 선택" description="5가지 프리셋 중 선택" />
            <Step number={3} title="프린트" description="Ctrl+P로 바로 인쇄" />
          </div>
        </section>

        {/* Why Print with printmd */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              왜 printmd로 프린트해야 할까요?
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon="🎨"
                title="코드 구문 강조"
                description="50+ 언어 지원. 코드가 컬러로 예쁘게 출력됩니다."
              />
              <Feature
                icon="📊"
                title="테이블 완벽 지원"
                description="마크다운 테이블이 깔끔한 표로 인쇄됩니다."
              />
              <Feature
                icon="🖼️"
                title="이미지 포함"
                description="문서 내 이미지도 함께 인쇄됩니다."
              />
              <Feature
                icon="📄"
                title="페이지 나눔"
                description="자동 페이지 나눔으로 깔끔한 출력."
              />
              <Feature
                icon="🔢"
                title="페이지 번호"
                description="머리글/바닥글에 페이지 번호 추가 가능."
              />
              <Feature
                icon="🖨️"
                title="인쇄 최적화"
                description="인쇄용 CSS로 깔끔한 출력 보장."
              />
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            이런 분들이 사용해요
          </h2>
          <div className="mt-12 space-y-6">
            <UseCase
              emoji="👨‍💻"
              title="개발자"
              description="README, API 문서, 기술 스펙을 인쇄해서 리뷰할 때"
            />
            <UseCase
              emoji="📚"
              title="학생"
              description="마크다운으로 작성한 노트, 과제물을 제출할 때"
            />
            <UseCase
              emoji="✍️"
              title="작가/블로거"
              description="마크다운 원고를 인쇄해서 교정할 때"
            />
            <UseCase
              emoji="👔"
              title="직장인"
              description="회의록, 보고서를 깔끔하게 인쇄할 때"
            />
          </div>
        </section>

        {/* Print Settings */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              인쇄 설정
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <PrintSetting
                title="용지 설정"
                items={['A4 / Letter / A3', '세로 / 가로 방향', '여백 조절']}
              />
              <PrintSetting
                title="머리글 / 바닥글"
                items={['제목 표시', '날짜 표시', '페이지 번호']}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            지금 바로 인쇄해보세요
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            무료 · 가입 불필요 · 브라우저에서 바로
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700"
          >
            printmd 시작하기
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

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600">{description}</p>
    </div>
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

function UseCase({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
      <span className="text-3xl">{emoji}</span>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function PrintSetting({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
