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
  const t = dict.chatgptToPdf;

  return buildPageMetadata({
    locale,
    path: '/chatgpt-to-pdf',
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? [
          // ChatGPT
          'chatgpt pdf 저장', 'chatgpt 대화 pdf', 'chatgpt 답변 pdf', 'chatgpt pdf 변환',
          '챗gpt pdf 저장', '챗지피티 pdf', '챗gpt 대화 저장', 'gpt 답변 저장', 'chatgpt 인쇄',
          'chatgpt 대화 내보내기', 'chatgpt 마크다운 pdf',
          // 다른 AI
          'claude pdf 저장', '클로드 대화 pdf', 'claude 답변 저장', 'gemini pdf 저장',
          '제미나이 대화 저장', 'ai 답변 pdf', 'ai 대화 pdf 저장', '퍼플렉시티 pdf',
          // 형식
          'ai 답변 문서로', 'chatgpt 코드 pdf', 'chatgpt 표 pdf',
        ]
      : [
          'chatgpt to pdf', 'save chatgpt conversation as pdf', 'chatgpt pdf export',
          'export chatgpt chat', 'print chatgpt conversation', 'chatgpt answer to pdf',
          'claude to pdf', 'save claude chat as pdf', 'gemini to pdf', 'ai chat to pdf',
          'chatgpt markdown to pdf', 'copy chatgpt to pdf',
        ],
  });
}

export default async function ChatgptToPdfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.chatgptToPdf;
  const pageUrl = `https://printmd.app/${locale}/chatgpt-to-pdf`;

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
    name: 'printmd - ChatGPT to PDF',
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
    name: locale === 'ko' ? 'ChatGPT 답변을 PDF로 저장하는 방법' : 'How to Save a ChatGPT Answer as PDF',
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
          </header>

          {/* Ad Banner */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AdBanner
              className="h-[90px] w-full rounded-lg overflow-hidden"
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
            />
          </div>

          {/* Why not just print the chat page */}
          <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900">{t.problem.title}</h2>
            <p className="mt-6 text-gray-600">{t.problem.desc}</p>
          </section>

          {/* Two ways in */}
          <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">{t.methods.title}</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Method title={t.methods.copyTitle} description={t.methods.copyDesc} />
              <Method title={t.methods.selectTitle} description={t.methods.selectDesc} />
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

          {/* What carries over */}
          <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-3xl font-bold text-gray-900">
                {t.kept.title}
              </h2>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SupportedFeature>{t.kept.headings}</SupportedFeature>
                <SupportedFeature>{t.kept.lists}</SupportedFeature>
                <SupportedFeature>{t.kept.tables}</SupportedFeature>
                <SupportedFeature>{t.kept.code}</SupportedFeature>
                <SupportedFeature>{t.kept.emphasis}</SupportedFeature>
                <SupportedFeature>{t.kept.links}</SupportedFeature>
                <SupportedFeature>{t.kept.highlight}</SupportedFeature>
                <SupportedFeature>{t.kept.themes}</SupportedFeature>
                <SupportedFeature>{t.kept.math}</SupportedFeature>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.useCases.title}
            </h2>
            <div className="mt-12 space-y-6">
              <UseCase emoji="📝" title={t.useCases.report} description={t.useCases.reportDesc} />
              <UseCase emoji="📚" title={t.useCases.study} description={t.useCases.studyDesc} />
              <UseCase emoji="👨‍💻" title={t.useCases.code} description={t.useCases.codeDesc} />
              <UseCase emoji="📊" title={t.useCases.meeting} description={t.useCases.meetingDesc} />
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
            <p className="mx-auto mt-10 max-w-2xl text-xs text-gray-400">{t.disclaimer}</p>
          </section>
        </main>
        <SiteFooter locale={locale} dict={dict.footer} />
      </div>
    </>
  );
}

function Method({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
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
