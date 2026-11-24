import Link from 'next/link';
import { AdSidebar } from '@/components/adsense/AdSidebar';
import { AdBanner } from '@/components/adsense/AdBanner';
import { TableOfContents } from './TableOfContents';
import { OnThisPage, SiteFooter, type FooterDict } from '@/components/layout';
import type { Locale } from '@/lib/i18n/config';
import { formatReadingTime } from '@/lib/blog/readingTime';

const TEXT: Record<Locale, { text: string; button: string }> = {
  en: { text: 'Convert your Markdown to PDF with printmd', button: 'Try printmd' },
  ko: { text: 'printmd로 마크다운을 PDF로 변환해보세요', button: 'printmd 시작하기' },
  zh: { text: '用 printmd 把你的 Markdown 转换成 PDF', button: '试用 printmd' },
  ja: { text: 'printmd で Markdown を PDF に変換してみましょう', button: 'printmd を試す' },
};

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogLayoutProps {
  locale: Locale;
  title: string;
  date: string;
  readingTime: number;
  tags: string[];
  content: string;
  headings: Heading[];
  tocTitle?: string;
  backLabel?: string;
  footerDict: FooterDict;
  children?: React.ReactNode;
}

export function BlogLayout({
  locale,
  title,
  date,
  readingTime,
  tags,
  content,
  headings,
  tocTitle,
  backLabel = '← Blog',
  footerDict,
}: BlogLayoutProps) {
  return (
    <div className="h-screen overflow-y-auto bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        article pre.hljs { background-color: #f8f9fa; color: #24292e; }
        article pre.hljs code { color: #24292e; }
        article pre.hljs .hljs-comment { color: #6a737d; }
        article pre.hljs .hljs-keyword,
        article pre.hljs .hljs-selector-tag { color: #d73a49; }
        article pre.hljs .hljs-string,
        article pre.hljs .hljs-attr { color: #032f62; }
        article pre.hljs .hljs-number,
        article pre.hljs .hljs-literal { color: #005cc5; }
        article pre.hljs .hljs-function,
        article pre.hljs .hljs-title { color: #6f42c1; }
        article pre.hljs .hljs-built_in { color: #e36209; }
        article pre.hljs .hljs-section { color: #005cc5; }
        article pre.hljs .hljs-bullet { color: #e36209; }
        article pre.hljs .hljs-code { color: #6f42c1; }
      `}} />
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {backLabel}
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">{title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <time dateTime={date}>{date}</time>
            <span>·</span>
            <span>{formatReadingTime(readingTime, locale)}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <main className="min-w-0 flex-1 max-w-4xl">
            {/* Inline outline on narrow screens; wide screens get the sticky one in the aside. */}
            <div className="lg:hidden">
              <TableOfContents headings={headings} title={tocTitle} />
            </div>

            <AdBanner
              className="h-[90px] w-full rounded-lg overflow-hidden mb-8"
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
            />

            <article
              className="prose prose-gray max-w-none
                prose-headings:scroll-mt-20
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
                prose-img:rounded-lg
                prose-li:text-gray-600
                prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600
                prose-table:text-sm
                prose-th:bg-gray-50
              "
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <AdBanner
              className="h-[90px] w-full rounded-lg overflow-hidden mt-8"
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
            />

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                {TEXT[locale].text}
              </p>
              <Link
                href={`/${locale}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {TEXT[locale].button}
              </Link>
            </div>
          </main>

          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-8 flex flex-col gap-6">
              <OnThisPage
                items={headings}
                title={tocTitle ?? 'Table of Contents'}
                listClassName="max-h-[40vh]"
              />
              <AdSidebar
                className="h-[600px] w-[160px] rounded-lg overflow-hidden"
                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
              />
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter locale={locale} dict={footerDict} />
    </div>
  );
}
