import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { AdBanner } from '@/components/adsense/AdBanner';
import { SiteFooter } from '@/components/layout';

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
  const t = dict.hwpToMarkdown;

  return buildPageMetadata({
    locale,
    path: '/hwp-to-markdown',
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? [
          // 핵심 키워드
          'hwp 마크다운 변환', 'hwpx 마크다운 변환', 'hwp to markdown', 'hwpx to markdown',
          'hwp md 변환', 'hwpx md 변환', '한글 마크다운 변환', '한글 문서 마크다운',
          '한글 파일 마크다운', 'hwp 마크다운', 'hwpx 마크다운', '한글 md 변환',
          // 텍스트 추출·AI 활용
          'hwp 텍스트 추출', 'hwpx 텍스트 추출', 'hwp 챗gpt', '한글 문서 chatgpt',
          '한글 문서 AI 요약', 'hwp 클로드', '공고문 요약', 'hwp ai 변환',
          // 이전·활용
          'hwp 노션 변환', 'hwp 옵시디언', 'hwp 깃허브', '한글 문서 노션 옮기기',
          // 무료·보안
          'hwp 변환 무료', 'hwpx 변환기', 'hwp 변환 사이트', '설치 없이 hwp 변환',
          'hwp 변환 업로드 없이', '브라우저 hwp 변환',
          // PDF
          'hwpx pdf 변환', '한글 문서 pdf 다시 만들기',
        ]
      : [
          'hwp to markdown', 'hwpx to markdown', 'hwp to md', 'hwpx to md',
          'hangul to markdown', 'hangul document converter', 'hwp converter',
          'hwpx converter', 'convert hwp online', 'hwp text extraction',
          'hwp to chatgpt', 'hwp to notion', 'hwpx parser online',
          'hwp converter no upload', 'free hwpx converter', 'hwpx to pdf',
        ],
  });
}

export default async function HwpToMarkdownPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.hwpToMarkdown;
  const pageUrl = `https://printmd.app/${locale}/hwp-to-markdown`;

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
  ];

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'printmd - HWP to Markdown',
    description: t.hero.description,
    url: pageUrl,
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
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'ko' ? '한글(HWP·HWPX) 문서를 마크다운으로 변환하는 방법' : 'How to Convert an HWP or HWPX Document to Markdown',
    description: t.hero.description,
    totalTime: 'PT1M',
    tool: {
      '@type': 'HowToTool',
      name: 'printmd',
    },
    step: [
      { name: t.steps.step1, text: t.steps.step1Desc },
      { name: t.steps.step2, text: t.steps.step2Desc },
      { name: t.steps.step3, text: t.steps.step3Desc },
    ].map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      ...step,
      url: `https://printmd.app/${locale}`,
    })),
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
        name: t.title,
        item: pageUrl,
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
        <main>
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
            <p className="mx-auto mt-8 max-w-xl text-sm text-gray-500">
              {t.hero.hint}
            </p>
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
              <Feature icon="🔒" title={t.why.privacy} description={t.why.privacyDesc} />
              <Feature icon="🧱" title={t.why.structure} description={t.why.structureDesc} />
              <Feature icon="🤖" title={t.why.ai} description={t.why.aiDesc} />
              <Feature icon="🖨️" title={t.why.print} description={t.why.printDesc} />
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

          {/* What gets converted */}
          <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-3xl font-bold text-gray-900">
                {t.converted.title}
              </h2>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SupportedFeature>{t.converted.headings}</SupportedFeature>
                <SupportedFeature>{t.converted.bigText}</SupportedFeature>
                <SupportedFeature>{t.converted.banner}</SupportedFeature>
                <SupportedFeature>{t.converted.emphasis}</SupportedFeature>
                <SupportedFeature>{t.converted.tables}</SupportedFeature>
                <SupportedFeature>{t.converted.boxes}</SupportedFeature>
                <SupportedFeature>{t.converted.lineBreaks}</SupportedFeature>
                <SupportedFeature>{t.converted.images}</SupportedFeature>
                <SupportedFeature>{t.converted.sections}</SupportedFeature>
              </div>

              <h3 className="mt-16 text-center text-xl font-bold text-gray-900">
                {t.limits.title}
              </h3>
              <ul className="mx-auto mt-6 max-w-3xl space-y-3 text-sm text-gray-600">
                <Limit>{t.limits.merged}</Limit>
                <Limit>{t.limits.numbering}</Limit>
                <Limit>{t.limits.images}</Limit>
                <Limit>{t.limits.hwp}</Limit>
              </ul>
            </div>
          </section>

          {/* HWP → HWPX guide */}
          <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.hwpGuide.title}
            </h2>
            <ol className="mt-10 space-y-4">
              {[t.hwpGuide.step1, t.hwpGuide.step2, t.hwpGuide.step3, t.hwpGuide.step4].map((step, i) => (
                <li key={step} className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Use Cases */}
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.useCases.title}
            </h2>
            <div className="mt-12 space-y-6">
              <UseCase emoji="📢" title={t.useCases.ai} description={t.useCases.aiDesc} />
              <UseCase emoji="🗂️" title={t.useCases.notes} description={t.useCases.notesDesc} />
              <UseCase emoji="✨" title={t.useCases.reprint} description={t.useCases.reprintDesc} />
              <UseCase emoji="👨‍💻" title={t.useCases.dev} description={t.useCases.devDesc} />
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-3xl font-bold text-gray-900">
                {t.faq.title}
              </h2>
              <div className="mt-12 space-y-4">
                {faqs.map(({ q, a }) => (
                  <FaqItem key={q} question={q} answer={a} />
                ))}
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
        </main>
        <SiteFooter locale={locale} dict={dict.footer} />
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
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function SupportedFeature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
      <span className="text-green-500" aria-hidden="true">✓</span>
      <span className="text-gray-700">{children}</span>
    </div>
  );
}

function Limit({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 text-amber-500" aria-hidden="true">!</span>
      <span>{children}</span>
    </li>
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
      <div className="text-3xl" aria-hidden="true">{emoji}</div>
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
