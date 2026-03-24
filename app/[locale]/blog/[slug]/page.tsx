import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getPostBySlug, getPostSlugs, extractHeadings } from '@/lib/blog';
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

  return {
    title: `${post.title} - printmd Blog`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `https://printmd.app/${locale}/blog/${slug}`,
      tags: post.tags,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/blog/${slug}`,
      languages: {
        ko: `https://printmd.app/ko/blog/${slug}`,
        en: `https://printmd.app/en/blog/${slug}`,
      },
    },
  };
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

  const contentWithIds = post.content.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
    (_match, level, attrs, text) => {
      const plainText = text.replace(/<[^>]*>/g, '');
      const id = plainText
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
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
        tocTitle={locale === 'ko' ? '목차' : 'Table of Contents'}
        backLabel={locale === 'ko' ? '← 블로그' : '← Blog'}
      />
    </>
  );
}
