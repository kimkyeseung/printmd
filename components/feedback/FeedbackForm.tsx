'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { FEEDBACK_LIMITS, type FeedbackError } from '@/lib/feedback/submit';
import { FEEDBACK_STRINGS } from '@/lib/feedback/strings';
import { feedbackMailto } from '@/lib/feedback/mailto';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; error: FeedbackError };

/** Where the visitor came from, as a same-site path (other sites are left out). */
function referrerPath(): string {
  try {
    const ref = new URL(document.referrer);
    return ref.origin === window.location.origin ? ref.pathname + ref.search : '';
  } catch {
    return '';
  }
}

export function FeedbackForm({ locale }: { locale: Locale }) {
  const t = FEEDBACK_STRINGS[locale];
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  // When the form became usable; reset after each successful send.
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === 'sending') return;
    if (!message.trim()) {
      setStatus({ kind: 'error', error: 'empty' });
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          message,
          website: honeypot.current?.value ?? '',
          startedAt: startedAt.current,
          locale,
          page: referrerPath(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: FeedbackError };
      if (res.ok && data.ok) {
        setStatus({ kind: 'sent' });
        setMessage('');
      } else {
        setStatus({ kind: 'error', error: data.error && data.error in t.errors ? data.error : 'server' });
      }
    } catch {
      setStatus({ kind: 'error', error: 'server' });
    }
  }

  const mailHref = feedbackMailto({ subject: locale === 'ko' ? '[printmd] 의견' : '[printmd] Feedback', bodyIntro: '', envHeading: '' });

  if (status.kind === 'sent') {
    return (
      <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <p className="font-medium">{t.success}</p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus({ kind: 'idle' });
          }}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const sending = status.kind === 'sending';
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-900">
          {t.nameLabel} <span className="font-normal text-gray-500">{t.nameOptional}</span>
        </label>
        <input
          id="feedback-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={FEEDBACK_LIMITS.name}
          placeholder={t.namePlaceholder}
          autoComplete="name"
          className="mt-1.5 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-900">
          {t.messageLabel}
        </label>
        <textarea
          id="feedback-message"
          name="message"
          required
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={FEEDBACK_LIMITS.message}
          placeholder={t.messagePlaceholder}
          aria-describedby="feedback-count"
          className="mt-1.5 block w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <p id="feedback-count" className="mt-1 text-right text-xs tabular-nums text-gray-500">
          {message.length} / {FEEDBACK_LIMITS.message}
        </p>
      </div>

      {status.kind === 'error' && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {t.errors[status.error]}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? t.sending : t.submit}
        </button>
        <p className="text-sm text-gray-500">
          {t.mailFallback}{' '}
          <a href={mailHref} className="text-blue-600 hover:underline">
            {t.mailLink}
          </a>
        </p>
      </div>

      <p className="text-xs leading-relaxed text-gray-500">{t.privacyNote}</p>
    </form>
  );
}
