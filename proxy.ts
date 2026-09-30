import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './lib/i18n/config';

// Paths that must never be locale-prefixed.
const reservedPaths = new Set([
  '/sitemap.xml',
  '/robots.txt',
  '/~offline',
  '/opengraph-image',
  '/twitter-image',
]);

function getLocale(request: NextRequest): Locale {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang as Locale));

    if (preferredLocale) {
      return preferredLocale as Locale;
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for static files, API routes, and special Next.js paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    reservedPaths.has(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const currentLocale = locales.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    const response = NextResponse.next();
    const lang = currentLocale || defaultLocale;
    // `lang` on <html> comes from the [locale] route param, not this header —
    // reading a request header in the layout would disable static generation.
    response.headers.set('Content-Language', lang);
    return response;
  }

  // Everything else gets a locale prefix. Paths that turn out not to exist
  // still 404 — from `/{locale}{pathname}` rather than here — which keeps
  // shared links like /cheatsheet or /blog/<slug> working.
  const locale = getLocale(request);
  // `/` maps to `/{locale}` directly; `/{locale}/` would cost a second
  // trailing-slash redirect.
  const newUrl = new URL(
    pathname === '/' ? `/${locale}` : `/${locale}${pathname}`,
    request.url
  );

  // Preserve query parameters
  newUrl.search = request.nextUrl.search;

  // Temporary: the target depends on Accept-Language, so browsers and CDNs
  // must not cache it as the permanent destination for this URL.
  return NextResponse.redirect(newUrl, 307);
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
