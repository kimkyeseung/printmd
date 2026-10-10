import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { AdBanner } from '@/components/adsense/AdBanner';
import { SiteFooter } from '@/components/layout';
import { HangulFileOpener } from '@/components/viewer/HangulFileOpener';

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
  const t = dict.hwpViewer;

  return buildPageMetadata({
    locale,
    path: '/hwp-viewer',
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? [
          // 뷰어
          'hwp 뷰어', '한글 뷰어', 'hwp 파일 열기', '한글 파일 열기', 'hwp 온라인 뷰어',
          'hwpx 뷰어', 'hwp 보기', '한글 파일 보기', '한컴 없이 hwp 열기', 'hwp 무료 뷰어',
          // 기기
          '맥 hwp', '맥 hwp 열기', '맥북 hwp 열기', '맥에서 한글 파일', '크롬북 hwp',
          '아이패드 hwp', '모바일 hwp 열기', '리눅스 hwp',
          // PDF
          'hwp pdf 변환', 'hwp를 pdf로', '한글 파일 pdf 변환', 'hwp pdf 저장', 'hwpx pdf 변환',
          'hwp pdf 변환 무료', 'hwp pdf 변환 사이트', '한글 pdf 변환',
          // 보안
          'hwp 변환 업로드 없이', '설치 없이 hwp',
        ]
      : [
          'hwp viewer', 'hwp file viewer', 'open hwp file', 'hwp viewer online', 'hwpx viewer',
          'hangul viewer', 'hwp file mac', 'open hwp on mac', 'hwp chromebook',
          'hwp to pdf', 'convert hwp to pdf', 'hwp to pdf online', 'hwp to pdf free',
          'hangul to pdf', 'hwp viewer no install',
        ],
  });
}

export default async function HwpViewerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.hwpViewer;
  const pageUrl = `https://printmd.app/${locale}/hwp-viewer`;

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
    name: 'printmd - HWP Viewer',
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
    name: locale === 'ko' ? 'HWP 파일을 PDF로 변환하는 방법' : 'How to Convert an HWP File to PDF',
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
      url: pageUrl,
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
          {/* Hero: the page is the viewer's front door, so it opens files itself. */}
          <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {t.hero.title1}
              <br />
              <span className="text-blue-600">{t.hero.title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {t.hero.description}
            </p>
            <HangulFileOpener
              locale={locale}
              t={{ open: t.hero.open, opening: t.hero.opening, dropHint: t.hero.dropHint }}
            />
            <p className="mx-auto mt-6 max-w-xl text-sm text-gray-500">
              {t.hero.note}
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
              <Feature icon="🧩" title={t.why.noInstall} description={t.why.noInstallDesc} />
              <Feature icon="💻" title={t.why.anyDevice} description={t.why.anyDeviceDesc} />
              <Feature icon="🔒" title={t.why.privacy} description={t.why.privacyDesc} />
              <Feature icon="🖨️" title={t.why.pdf} description={t.why.pdfDesc} />
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
              <UseCase emoji="🍎" title={t.useCases.mac} description={t.useCases.macDesc} />
              <UseCase emoji="📢" title={t.useCases.notice} description={t.useCases.noticeDesc} />
              <UseCase emoji="🏢" title={t.useCases.office} description={t.useCases.officeDesc} />
              <UseCase emoji="📤" title={t.useCases.share} description={t.useCases.shareDesc} />
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
              <p className="mt-10 text-center text-sm text-gray-600">
                {t.related}{' '}
                <Link href={`/${locale}/hwp-to-markdown`} className="font-semibold text-blue-600 hover:underline">
                  {t.relatedLink}
                </Link>
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900">{t.cta.title}</h2>
            <p className="mt-4 text-lg text-gray-600">{t.cta.subtitle}</p>
            <HangulFileOpener
              locale={locale}
              t={{ open: t.hero.open, opening: t.hero.opening, dropHint: t.hero.dropHint }}
            />
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
