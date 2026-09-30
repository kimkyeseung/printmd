import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

export const SITE_URL = 'https://printmd.app';
export const SITE_NAME = 'printmd';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ko: 'ko_KR',
};

export interface SocialImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

/** Served by `app/opengraph-image.tsx`. */
export const DEFAULT_SOCIAL_IMAGE: SocialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'printmd - Markdown to PDF',
};

interface PageMetadataOptions {
  locale: Locale;
  /** Path after the locale prefix: '' for the home page, '/guide' etc. */
  path: string;
  /**
   * Page title without the brand. The `[locale]` layout template appends
   * ` | printmd`, so adding it here would print the brand twice.
   */
  title: string;
  description: string;
  keywords?: string | string[];
  /** Use when the title already leads with the brand (home, about). */
  absoluteTitle?: boolean;
  image?: SocialImage;
  article?: {
    publishedTime?: string;
    tags?: string[];
  };
}

export function localeUrl(locale: Locale, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * Metadata shared by every page under `[locale]`.
 *
 * A page that sets `openGraph` or `twitter` replaces the parent's object
 * wholesale — including the image that `opengraph-image.tsx` /
 * `twitter-image.tsx` would otherwise contribute. So every page needs the
 * full set (locale, siteName, images) spelled out, which is what this builds.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  absoluteTitle = false,
  image = DEFAULT_SOCIAL_IMAGE,
  article,
}: PageMetadataOptions): Metadata {
  const url = localeUrl(locale, path);
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = localeUrl(l, path);
  }
  languages['x-default'] = localeUrl(defaultLocale, path);

  const openGraphBase = {
    title: socialTitle,
    description,
    url,
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    images: [image],
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: article
      ? { ...openGraphBase, type: 'article', ...article }
      : { ...openGraphBase, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
