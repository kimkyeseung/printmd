export const locales = ['en', 'ko', 'zh', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  zh: '简体中文',
  ja: '日本語',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ko: '🇰🇷',
  zh: '🇨🇳',
  ja: '🇯🇵',
};

/** BCP 47 tag for <html lang>, Intl formatting and JSON-LD inLanguage. */
export const localeTags: Record<Locale, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ja: 'ja-JP',
};

/** Cookie the language switcher sets so `/` keeps the reader's choice. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
