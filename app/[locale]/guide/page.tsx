import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { AdBanner } from '@/components/adsense/AdBanner';
import { AdSidebar } from '@/components/adsense/AdSidebar';
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
  const t = dict.guide;

  return {
    title: `${t.title} - ${t.subtitle}`,
    description: t.description,
    keywords: t.keywords.split(','),
    openGraph: {
      title: `${t.title} - ${t.subtitle} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/guide`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/guide`,
      languages: {
        'ko': 'https://printmd.app/ko/guide',
        'en': 'https://printmd.app/en/guide',
      },
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.guide;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${t.title} - ${t.subtitle}`,
    description: t.description,
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
      '@id': `https://printmd.app/${locale}/guide`,
    },
    articleSection: 'Tutorial',
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    datePublished: '2025-03-01',
    dateModified: '2026-03-13',
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
        name: t.title,
        item: `https://printmd.app/${locale}/guide`,
      },
    ],
  };

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
      <div className="h-screen overflow-y-auto bg-white">
        {/* Header */}
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${locale}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t.backLink}
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            {t.heading}
          </h1>
          <p className="mt-2 text-gray-600">
            {t.subheading}
          </p>
        </div>
      </header>

      {/* Ad Banner - Top */}
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
        <AdBanner
          className="h-[90px] w-full rounded-lg overflow-hidden"
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
        />
      </div>

      {/* Content with Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Table of Contents */}
            <nav className="mb-12 rounded-xl bg-gray-50 p-6">
          <h2 className="font-semibold text-gray-900">{t.toc}</h2>
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
            syntaxLabel={t.syntaxLabel}
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
            syntaxLabel={t.syntaxLabel}
            id="emphasis"
            title="강조 (Emphasis)"
            description="텍스트를 굵게, 기울임, 취소선으로 표시할 수 있습니다."
            syntax={`**굵은 텍스트** 또는 __굵은 텍스트__
*기울임 텍스트* 또는 _기울임 텍스트_
~~취소선 텍스트~~
***굵은 기울임***`}
          />

          <SyntaxSection
            syntaxLabel={t.syntaxLabel}
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
            syntaxLabel={t.syntaxLabel}
            id="links"
            title="링크 (Links)"
            description="텍스트에 링크를 추가할 수 있습니다."
            syntax={`[링크 텍스트](https://example.com)
[제목 있는 링크](https://example.com "링크 제목")

URL 자동 링크:
https://example.com`}
          />

          {/* In-article Ad */}
          <div className="lg:hidden">
            <AdBanner
              className="h-[90px] w-full rounded-lg overflow-hidden"
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE}
            />
          </div>

          <SyntaxSection
            syntaxLabel={t.syntaxLabel}
            id="images"
            title="이미지 (Images)"
            description="이미지를 삽입할 수 있습니다."
            syntax={`![대체 텍스트](이미지URL)
![대체 텍스트](이미지URL "이미지 제목")`}
          />

          <SyntaxSection
            syntaxLabel={t.syntaxLabel}
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
            syntaxLabel={t.syntaxLabel}
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
            syntaxLabel={t.syntaxLabel}
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
            syntaxLabel={t.syntaxLabel}
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
                {t.ctaTitle}
              </h2>
              <p className="mt-2 text-gray-600">
                {t.ctaSubtitle}
              </p>
              <Link
                href={`/${locale}`}
                className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {t.ctaButton}
              </Link>
            </div>
          </main>

          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-8">
              <AdSidebar
                className="h-[250px] w-[300px] rounded-lg overflow-hidden"
                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
              />
              <div className="mt-6">
                <AdSidebar
                  className="h-[250px] w-[300px] rounded-lg overflow-hidden"
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter locale={locale} dict={dict.footer} />
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
  syntaxLabel,
}: {
  id: string;
  title: string;
  description: string;
  syntax: string;
  syntaxLabel: string;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
        <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
          {syntaxLabel}
        </div>
        <pre className="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100">
          <code>{syntax}</code>
        </pre>
      </div>
    </section>
  );
}
