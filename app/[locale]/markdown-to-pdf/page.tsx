import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { AdBanner } from '@/components/adsense/AdBanner';

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
  const t = dict.markdownToPdf;

  return {
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? [
          // 핵심 키워드
          '마크다운 PDF 변환', '마크다운 to PDF', 'markdown to pdf', 'md to pdf',
          '마크다운 변환기', '마크다운 PDF 변환기', '마크다운 PDF 저장', '마크다운 PDF 출력',
          '마크다운 PDF 내보내기', '무료 마크다운 변환', '온라인 마크다운 변환', '마크다운 PDF 무료',
          // md 파일 관련
          'md 변환', 'md 파일 PDF', 'md 파일 변환', 'md 파일 PDF 변환', 'md to pdf 변환기',
          'md pdf 변환', 'md 문서 PDF', '.md to pdf', '.md 파일 변환',
          // 마크다운 변환 변형
          '마크다운 파일 PDF 변환', '마크다운 문서 PDF', '마크다운 텍스트 PDF',
          '마크다운 pdf 만들기', '마크다운으로 pdf', '마크다운에서 pdf',
          '마크다운 pdf 변환 사이트', '마크다운 pdf 변환 온라인', '마크다운 pdf 변환 무료',
          // README 관련
          'README PDF 변환', 'readme to pdf', 'README md PDF', 'README 파일 PDF',
          'README PDF 저장', '깃허브 README PDF', 'github readme pdf 변환',
          // 인쇄/프린트 관련
          '마크다운 인쇄', '마크다운 프린트', '마크다운 출력', 'md 파일 인쇄', 'md 프린트',
          // 무료/온라인 강조
          '무료 PDF 변환', '온라인 PDF 변환', '무료 마크다운 변환기', '온라인 마크다운 변환기',
          '무료 md 변환', '브라우저 마크다운 변환', '설치 없이 마크다운 변환',
          // 사용 시나리오
          '마크다운 과제 PDF', '마크다운 보고서 PDF', '마크다운 문서화', '기술문서 PDF 변환',
          '노션 마크다운 PDF', '옵시디언 PDF 변환', 'vscode 마크다운 pdf',
          // 스타일/테마/프리셋 관련
          '마크다운 스타일 PDF', '마크다운 테마 PDF', '마크다운 커스텀 PDF', '마크다운 프리셋',
          '마크다운 PDF 꾸미기', '마크다운 PDF 디자인', '마크다운 스타일 저장',
          '마크다운 폰트 설정', '마크다운 글꼴 변경', '마크다운 PDF 글꼴',
          '마크다운 다크모드 PDF', '예쁜 마크다운 PDF', '깔끔한 마크다운 PDF',
          '마크다운 PDF 색상', '마크다운 PDF 여백', '마크다운 PDF 줄간격',
          // 영문 혼합
          'markdown pdf converter', 'markdown to pdf converter', 'convert markdown to pdf',
          'markdown to pdf online free', 'best markdown to pdf', 'markdown to pdf tool',
        ]
      : [
          // Core keywords
          'markdown to pdf', 'md to pdf', 'markdown converter', 'pdf converter',
          'convert markdown to pdf', 'markdown to pdf online', 'markdown to pdf free',
          'markdown pdf converter', 'markdown export pdf', 'markdown to pdf converter',
          // md file variations
          'md to pdf converter', 'md to pdf online', 'md file to pdf', 'md to pdf free',
          '.md to pdf', '.md file to pdf', 'md document to pdf', 'md convert to pdf',
          // Markdown file variations
          'markdown file to pdf', 'markdown save as pdf', 'markdown document to pdf',
          'markdown text to pdf', 'markdown to pdf document', 'markdown into pdf',
          // Free/online emphasis
          'free markdown converter', 'free markdown to pdf converter',
          'markdown to pdf converter online', 'online markdown to pdf converter',
          'best markdown to pdf converter', 'best free markdown to pdf',
          'markdown to pdf no signup', 'markdown to pdf no install',
          'markdown to pdf browser', 'markdown to pdf web app',
          // README related
          'readme to pdf', 'github readme to pdf', 'github markdown to pdf',
          'readme md to pdf', 'readme file to pdf', 'convert readme to pdf',
          // Use case keywords
          'markdown report to pdf', 'markdown notes to pdf', 'markdown resume to pdf',
          'markdown document export', 'markdown to printable pdf',
          'markdown to styled pdf', 'markdown to beautiful pdf',
          // Tool/action keywords
          'markdown pdf tool', 'markdown pdf generator', 'markdown pdf maker',
          'markdown pdf creator', 'markdown pdf export tool', 'generate pdf from markdown',
          'create pdf from markdown', 'make pdf from markdown', 'turn markdown into pdf',
          // Print related
          'print markdown', 'print markdown file', 'markdown printer',
          'markdown print to pdf', 'print md file',
          // Comparison/alternative keywords
          'markdown to pdf alternative', 'pandoc alternative', 'markdown to pdf without pandoc',
          'markdown to pdf without command line', 'easy markdown to pdf',
          'simple markdown to pdf', 'quick markdown to pdf', 'fast markdown to pdf',
          // Format related
          'text to pdf', 'document converter', 'free pdf converter', 'pdf export',
          'markdown to pdf with styling', 'markdown to pdf with themes',
          'markdown to pdf with syntax highlighting', 'markdown to pdf with code blocks',
          // Custom style/theme/preset keywords
          'markdown custom style', 'markdown custom theme', 'markdown pdf theme preset',
          'markdown style preset', 'custom markdown pdf template', 'save markdown style',
          'markdown style template', 'markdown pdf template', 'markdown pdf design',
          'markdown to pdf with custom styles', 'markdown to pdf custom theme',
          'markdown pdf custom font', 'custom font markdown', 'markdown element styling',
          'styled markdown to pdf', 'markdown pdf preset save', 'markdown pdf preset load',
          'markdown dark theme pdf', 'markdown blog style pdf', 'markdown minimal style',
          'personalized markdown pdf', 'markdown pdf customization', 'customize markdown pdf',
          'markdown pdf font size', 'markdown pdf color', 'markdown pdf line height',
        ],
    openGraph: {
      title: `${t.title} - ${t.subtitle} | printmd`,
      description: t.hero.description,
      url: `https://printmd.app/${locale}/markdown-to-pdf`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/markdown-to-pdf`,
      languages: {
        'ko': 'https://printmd.app/ko/markdown-to-pdf',
        'en': 'https://printmd.app/en/markdown-to-pdf',
      },
    },
  };
}

export default async function MarkdownToPdfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.markdownToPdf;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'printmd - Markdown to PDF',
    description: t.hero.description,
    url: `https://printmd.app/${locale}/markdown-to-pdf`,
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
      { '@type': 'Question', name: t.faq.q1, acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 } },
      { '@type': 'Question', name: t.faq.q2, acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 } },
      { '@type': 'Question', name: t.faq.q3, acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 } },
      { '@type': 'Question', name: t.faq.q4, acceptedAnswer: { '@type': 'Answer', text: t.faq.a4 } },
      { '@type': 'Question', name: t.faq.q5, acceptedAnswer: { '@type': 'Answer', text: t.faq.a5 } },
    ],
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'ko' ? '마크다운을 PDF로 변환하는 방법' : 'How to Convert Markdown to PDF',
    description: t.hero.description,
    totalTime: 'PT1M',
    tool: {
      '@type': 'HowToTool',
      name: 'printmd',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: t.steps.step1,
        text: t.steps.step1Desc,
        url: `https://printmd.app/${locale}`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: t.steps.step2,
        text: t.steps.step2Desc,
        url: `https://printmd.app/${locale}`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: t.steps.step3,
        text: t.steps.step3Desc,
        url: `https://printmd.app/${locale}`,
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
        name: 'Home',
        item: `https://printmd.app/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'ko' ? '마크다운 PDF 변환' : 'Markdown to PDF',
        item: `https://printmd.app/${locale}/markdown-to-pdf`,
      },
    ],
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="h-screen overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.hero.title1}
            <br />
            <span className="text-blue-600">{t.hero.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {t.hero.description}
          </p>
          <div className="mt-10">
            <Link
              href={`/${locale}`}
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              {t.hero.cta}
            </Link>
          </div>
        </header>

        {/* Ad Banner */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AdBanner
            className="h-[90px] w-full rounded-lg overflow-hidden"
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
          />
        </div>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.why.title}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon="⚡" title={t.why.fast} description={t.why.fastDesc} />
            <Feature icon="🔒" title={t.why.privacy} description={t.why.privacyDesc} />
            <Feature icon="🎨" title={t.why.themes} description={t.why.themesDesc} />
            <Feature icon="📱" title={t.why.responsive} description={t.why.responsiveDesc} />
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.steps.title}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step number={1} title={t.steps.step1} description={t.steps.step1Desc} />
            <Step number={2} title={t.steps.step2} description={t.steps.step2Desc} />
            <Step number={3} title={t.steps.step3} description={t.steps.step3Desc} />
          </div>
        </section>

        {/* Use Cases */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.useCases.title}
          </h2>
          <div className="mt-12 space-y-6">
            <UseCase emoji="👨‍💻" title={t.useCases.developer} description={t.useCases.developerDesc} />
            <UseCase emoji="📚" title={t.useCases.student} description={t.useCases.studentDesc} />
            <UseCase emoji="✍️" title={t.useCases.writer} description={t.useCases.writerDesc} />
            <UseCase emoji="👔" title={t.useCases.worker} description={t.useCases.workerDesc} />
          </div>
        </section>

        {/* Supported Features */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.supported.title}
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SupportedFeature>{t.supported.headings}</SupportedFeature>
              <SupportedFeature>{t.supported.formatting}</SupportedFeature>
              <SupportedFeature>{t.supported.lists}</SupportedFeature>
              <SupportedFeature>{t.supported.code}</SupportedFeature>
              <SupportedFeature>{t.supported.blockquote}</SupportedFeature>
              <SupportedFeature>{t.supported.table}</SupportedFeature>
              <SupportedFeature>{t.supported.links}</SupportedFeature>
              <SupportedFeature>{t.supported.hr}</SupportedFeature>
              <SupportedFeature>{t.supported.inlineCode}</SupportedFeature>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.faq.title}
            </h2>
            <div className="mt-12 space-y-4">
              <FaqItem question={t.faq.q1} answer={t.faq.a1} />
              <FaqItem question={t.faq.q2} answer={t.faq.a2} />
              <FaqItem question={t.faq.q3} answer={t.faq.a3} />
              <FaqItem question={t.faq.q4} answer={t.faq.a4} />
              <FaqItem question={t.faq.q5} answer={t.faq.a5} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">{t.cta.title}</h2>
          <p className="mt-4 text-lg text-gray-600">{t.cta.subtitle}</p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            {dict.common.tryNow}
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. {dict.common.copyright}</p>
          <a
            href="https://buymeacoffee.com/kimkyeseung"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-gray-400 hover:text-[#FFDD00] transition-colors"
          >
            ☕ Buy me a coffee
          </a>
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
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
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
      <div className="text-3xl">{emoji}</div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl bg-white shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-gray-900">
        {question}
        <span className="ml-2 text-blue-500 transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-6 pb-4 text-sm text-gray-600">
        {answer}
      </div>
    </details>
  );
}
