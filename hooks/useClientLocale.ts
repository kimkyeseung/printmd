'use client';

import { useParams } from 'next/navigation';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';

import en from '@/lib/i18n/dictionaries/en.json';
import ko from '@/lib/i18n/dictionaries/ko.json';
import zh from '@/lib/i18n/dictionaries/zh.json';
import ja from '@/lib/i18n/dictionaries/ja.json';

const dictionaries: Record<Locale, typeof en> = { en, ko, zh, ja };

export function useClientLocale() {
  const params = useParams();
  const param = params?.locale;
  return isLocale(param) ? param : defaultLocale;
}

export function useClientDictionary() {
  const locale = useClientLocale();
  return dictionaries[locale];
}
