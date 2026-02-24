import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '마크다운 PDF 변환 - 무료 온라인 도구',
  description:
    '마크다운(.md) 파일을 PDF로 무료 변환. 실시간 미리보기, 5가지 테마, 커스텀 스타일링, 드래그 앤 드롭 지원. 가입 없이 바로 사용.',
  keywords: [
    '마크다운 PDF',
    'markdown to pdf',
    'md to pdf',
    'markdown pdf 변환',
    '마크다운 변환기',
    'markdown converter',
    '무료 마크다운 도구',
    'online markdown editor',
  ],
  openGraph: {
    title: '마크다운 PDF 변환 - 무료 온라인 도구 | printmd',
    description:
      '마크다운(.md) 파일을 PDF로 무료 변환. 실시간 미리보기, 5가지 테마 지원.',
    url: 'https://printmd.app/markdown-to-pdf',
  },
  alternates: {
    canonical: 'https://printmd.app/markdown-to-pdf',
  },
};

export default function MarkdownToPdfPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          마크다운을
          <br />
          <span className="text-blue-600">PDF로 변환</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          .md 파일을 드래그 앤 드롭으로 업로드하고, 원하는 스타일로 예쁘게
          PDF로 저장하세요. 무료이며 가입이 필요 없습니다.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            무료로 변환하기
          </Link>
        </div>
      </header>

      {/* Drop Zone Preview */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-5xl">📄</div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            .md 파일을 여기에 드롭하거나
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-gray-100 px-6 py-2 text-gray-700 transition hover:bg-gray-200"
          >
            파일 선택
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            .md, .markdown, .txt 파일 지원
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          왜 printmd인가요?
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon="⚡"
            title="빠른 변환"
            description="클라이언트 사이드 처리로 즉시 변환"
          />
          <Feature
            icon="🔒"
            title="개인정보 보호"
            description="파일이 서버로 전송되지 않음"
          />
          <Feature
            icon="🎨"
            title="다양한 테마"
            description="5가지 프리셋 + 커스텀 스타일"
          />
          <Feature
            icon="📱"
            title="반응형 디자인"
            description="모바일에서도 사용 가능"
          />
        </div>
      </section>

      {/* Supported Features */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            지원하는 마크다운 기능
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SupportedFeature>제목 (H1-H6)</SupportedFeature>
            <SupportedFeature>굵게, 기울임, 취소선</SupportedFeature>
            <SupportedFeature>순서 있는/없는 목록</SupportedFeature>
            <SupportedFeature>코드 블록 (구문 강조)</SupportedFeature>
            <SupportedFeature>인용문</SupportedFeature>
            <SupportedFeature>테이블</SupportedFeature>
            <SupportedFeature>링크 & 이미지</SupportedFeature>
            <SupportedFeature>수평선</SupportedFeature>
            <SupportedFeature>인라인 코드</SupportedFeature>
          </div>
        </div>
      </section>

      {/* Print Settings */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          PDF 출력 설정
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <PrintOption
            title="용지 크기"
            items={['A4 (210 × 297mm)', 'Letter (8.5 × 11in)', 'A3 (297 × 420mm)']}
          />
          <PrintOption
            title="방향"
            items={['세로 (Portrait)', '가로 (Landscape)']}
          />
          <PrintOption
            title="머리글/바닥글"
            items={['제목', '날짜', '페이지 번호']}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">
          지금 바로 변환해보세요
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          무료 · 가입 불필요 · 파일 업로드 없음
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          printmd 시작하기
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
      </footer>
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
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function SupportedFeature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
      <span className="text-green-500">✓</span>
      <span className="text-gray-700">{children}</span>
    </div>
  );
}

function PrintOption({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-gray-600">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
