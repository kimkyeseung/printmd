import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.github;

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords.split(','),
    openGraph: {
      title: `${t.title} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/github`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/github`,
      languages: {
        'ko': 'https://printmd.app/ko/github',
        'en': 'https://printmd.app/en/github',
      },
    },
  };
}

export default async function GitHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'ko' ? 'GitHub README를 PDF로 변환하는 방법' : 'How to convert GitHub README to PDF',
    description: locale === 'ko'
      ? 'GitHub README.md 파일을 printmd로 예쁘게 PDF로 변환하는 방법'
      : 'How to convert GitHub README.md files to beautiful PDFs with printmd',
    totalTime: 'PT2M',
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'printmd Chrome Extension',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: locale === 'ko' ? 'Chrome 확장프로그램 설치' : 'Install Chrome Extension',
        text: locale === 'ko'
          ? 'Chrome 웹스토어에서 printmd 확장프로그램을 설치하세요.'
          : 'Install the printmd extension from the Chrome Web Store.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: locale === 'ko' ? 'GitHub에서 README 열기' : 'Open README on GitHub',
        text: locale === 'ko'
          ? '변환하고 싶은 README.md 파일이 있는 GitHub 저장소를 방문하세요.'
          : 'Visit the GitHub repository with the README.md file you want to convert.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: locale === 'ko' ? 'Open in printmd 클릭' : 'Click Open in printmd',
        text: locale === 'ko'
          ? 'README 옆에 나타나는 버튼을 클릭하면 printmd에서 열립니다.'
          : 'Click the button next to the README to open it in printmd.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: locale === 'ko' ? '스타일 선택 후 PDF 저장' : 'Choose style and save as PDF',
        text: locale === 'ko'
          ? '원하는 테마를 선택하고 PDF로 저장하거나 바로 인쇄하세요.'
          : 'Select your preferred theme and save as PDF or print directly.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <div className="h-screen overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          GitHub README를
          <br />
          <span className="text-blue-600">PDF로 변환</span>하세요
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          GitHub의 README.md 파일을 예쁘게 스타일링하고 PDF로 저장하세요.
          Chrome 확장프로그램으로 원클릭 변환이 가능합니다.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={`/${locale}`}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            지금 시작하기
          </Link>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-700 shadow transition hover:bg-gray-50"
          >
            Chrome 확장프로그램
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          주요 기능
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="🔗"
            title="원클릭 변환"
            description="GitHub 페이지에서 버튼 클릭 한 번으로 printmd에서 열기"
          />
          <FeatureCard
            icon="🎨"
            title="5가지 테마"
            description="Default, Dark, Document, Blog, Minimal 프리셋 제공"
          />
          <FeatureCard
            icon="✏️"
            title="커스텀 스타일링"
            description="폰트, 색상, 여백 등 세부 스타일 조절 가능"
          />
          <FeatureCard
            icon="📄"
            title="PDF 저장"
            description="A4, Letter, A3 용지 크기 지원, 머리글/바닥글 설정"
          />
          <FeatureCard
            icon="👀"
            title="실시간 미리보기"
            description="변경사항을 즉시 확인하며 편집"
          />
          <FeatureCard
            icon="💾"
            title="자동 저장"
            description="작업 내용이 브라우저에 자동 저장"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            사용 방법
          </h2>
          <div className="mt-12 space-y-8">
            <Step
              number={1}
              title="Chrome 확장프로그램 설치"
              description="Chrome 웹스토어에서 printmd 확장프로그램을 설치하세요."
            />
            <Step
              number={2}
              title="GitHub에서 README 열기"
              description="변환하고 싶은 README.md 파일이 있는 GitHub 저장소를 방문하세요."
            />
            <Step
              number={3}
              title="'Open in printmd' 클릭"
              description="README 옆에 나타나는 버튼을 클릭하면 printmd에서 열립니다."
            />
            <Step
              number={4}
              title="스타일 선택 후 PDF 저장"
              description="원하는 테마를 선택하고 PDF로 저장하거나 바로 인쇄하세요."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">
          지금 바로 시작하세요
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          무료로 사용할 수 있습니다. 가입이 필요 없습니다.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          printmd 열기
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
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
    <div className="flex gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
}
