'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const DISMISSED_KEY = 'printmd-extension-banner-dismissed';
const EXTENSION_URL = 'https://chromewebstore.google.com/detail/printmd-markdown-to-pdf/kkmojoaaiiffjeikjapcolhhjnbccfaf';

const TEXT = {
  ko: {
    message: 'Chrome 확장프로그램으로 GitHub 마크다운을 바로 가져올 수 있어요!',
    install: '설치하기',
  },
  en: {
    message: 'Get the Chrome extension to import GitHub Markdown instantly!',
    install: 'Install',
  },
} as const;

function isChromium(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Chrome\//.test(ua) || /Chromium\//.test(ua);
}

export function ExtensionBanner() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isChromium()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // The extension's content script (marker.ts) sets data-printmd-extension
    // on <html> at document_start. Small delay to ensure it's set.
    const timer = setTimeout(() => {
      const installed = document.documentElement.hasAttribute('data-printmd-extension');
      if (!installed) {
        setVisible(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  return (
    <div className="flex items-center justify-center gap-2 border-b border-[var(--ui-border)] bg-blue-50 px-4 py-2 text-sm dark:bg-blue-950/30 md:gap-3">
      {/* Chrome icon */}
      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="12" y1="2" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3.34" y1="17" x2="8.54" y2="13.8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20.66" y1="17" x2="15.46" y2="13.8" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <span className="truncate text-[var(--foreground)]">{t.message}</span>

      <a
        href={EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded bg-blue-600 px-3 py-0.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
      >
        {t.install}
      </a>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-0.5 text-[var(--ui-text-muted)] hover:text-[var(--foreground)] transition-colors"
        aria-label="Close banner"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
