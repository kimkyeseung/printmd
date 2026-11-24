import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import { localeTags, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getPostBySlug, getPostSlugs, extractHeadings, headingSlug } from '@/lib/blog';
import { BlogLayout } from '@/components/blog/BlogLayout';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const post = getPostBySlug(slug, locale);
  if (!post) return {};

  return buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    keywords: post.tags,
    image: {
      url: `/${locale}/blog/${slug}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: post.title,
    },
    article: {
      publishedTime: post.date,
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';

  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const dict = await getDictionary(locale);
  const headings = extractHeadings(post.content);

  const idCount = new Map<string, number>();
  const contentWithIds = post.content.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
    (_match, level, attrs, text) => {
      const plainText = text.replace(/<[^>]*>/g, '');
      let id = headingSlug(plainText);
      const count = idCount.get(id) || 0;
      idCount.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: localeTags[locale],
      keywords: post.tags,
      image: `https://printmd.app/${locale}/blog/${slug}/opengraph-image`,
      author: {
        '@type': 'Organization',
        name: 'printmd',
        url: 'https://printmd.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://printmd.app/icon-192.png',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'printmd',
        url: 'https://printmd.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://printmd.app/icon-192.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://printmd.app/${locale}/blog/${slug}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'printmd',
          item: `https://printmd.app/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: dict.blog.title,
          item: `https://printmd.app/${locale}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://printmd.app/${locale}/blog/${slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogLayout
        locale={locale}
        title={post.title}
        date={post.date}
        readingTime={post.readingTime}
        tags={post.tags}
        content={contentWithIds}
        headings={headings}
        tocTitle={({ ko: '목차', en: 'Table of Contents', zh: '目录', ja: '目次' } as Record<Locale, string>)[locale]}
        backLabel={({ ko: '← 블로그', en: '← Blog', zh: '← 博客', ja: '← ブログ' } as Record<Locale, string>)[locale]}
        footerDict={dict.footer}
      />
    </>
  );
}
