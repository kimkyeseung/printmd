import { isLocale, type Locale } from '@/lib/i18n/config';

const READING_TIME: Record<Locale, (minutes: number) => string> = {
  en: (m) => `${m} min read`,
  ko: (m) => `${m}분 분량`,
  zh: (m) => `阅读约 ${m} 分钟`,
  ja: (m) => `約 ${m} 分で読めます`,
};

/** "5 min read" in the page's language. */
export function formatReadingTime(minutes: number, locale: string): string {
  return READING_TIME[isLocale(locale) ? locale : 'en'](minutes);
}
