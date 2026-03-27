import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getAllPosts } from '@/lib/blog';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { AdBanner } from '@/components/adsense/AdBanner';
import { SiteFooter } from '@/components/layout';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.blog;

  return {
    title: `${t.title} - printmd`,
    description: t.description,
    openGraph: {
      title: `${t.title} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/blog`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/blog`,
      languages: {
        ko: 'https://printmd.app/ko/blog',
        en: 'https://printmd.app/en/blog',
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.blog;
  const posts = getAllPosts(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t.title,
    description: t.description,
    url: `https://printmd.app/${locale}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'printmd',
      url: 'https://printmd.app',
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://printmd.app/${locale}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${locale}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← printmd
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-gray-600">{t.description}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <AdBanner
          className="h-[90px] w-full rounded-lg overflow-hidden mb-8"
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-12">{t.noPosts}</p>
        )}

        <AdBanner
          className="h-[90px] w-full rounded-lg overflow-hidden mt-8"
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
        />
      </main>
      <SiteFooter locale={locale} dict={dict.footer} />
    </div>
  );
}
