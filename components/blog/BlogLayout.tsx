import Link from 'next/link';
import { AdSidebar } from '@/components/adsense/AdSidebar';
import { AdBanner } from '@/components/adsense/AdBanner';
import { TableOfContents } from './TableOfContents';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogLayoutProps {
  locale: string;
  title: string;
  date: string;
  readingTime: number;
  tags: string[];
  content: string;
  headings: Heading[];
  tocTitle?: string;
  backLabel?: string;
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
}: BlogLayoutProps) {
  return (
    <div className="h-screen overflow-y-auto bg-white">
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
            <span>{readingTime} min read</span>
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
            <TableOfContents headings={headings} title={tocTitle} />

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
                {locale === 'ko'
                  ? 'printmd로 마크다운을 PDF로 변환해보세요'
                  : 'Convert your Markdown to PDF with printmd'}
              </p>
              <Link
                href={`/${locale}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {locale === 'ko' ? 'printmd 시작하기' : 'Try printmd'}
              </Link>
            </div>
          </main>

          <aside className="hidden lg:block w-[180px] shrink-0">
            <div className="sticky top-8">
              <AdSidebar
                className="h-[600px] w-[160px] rounded-lg overflow-hidden"
                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
              />
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
