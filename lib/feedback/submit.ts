/*
 * Shared rules for the feedback form: what the browser sends, how the server
 * checks it, and the Discord message it becomes. Kept free of server-only
 * code so the form can use the same limits.
 */

import { defaultLocale, isLocale } from '@/lib/i18n/config';

export const FEEDBACK_LIMITS = {
  name: 50,
  message: 2000,
  page: 300,
  /** A person needs at least this long between seeing the form and sending it. */
  minFillMs: 3000,
  /** A form older than this is treated as stale rather than trusted. */
  maxFillMs: 24 * 60 * 60 * 1000,
} as const;

export interface FeedbackPayload {
  name: string;
  message: string;
  /** Honeypot: hidden from people, so anything in it came from a bot. */
  website: string;
  /** When the form was shown (ms since epoch, from the browser clock). */
  startedAt: number;
  locale: string;
  /** The page the visitor came from, if any. */
  page: string;
}

export type FeedbackError = 'invalid' | 'empty' | 'tooLong' | 'tooFast' | 'rateLimited' | 'server';

export type ValidationResult =
  | { ok: true; value: { name: string; message: string; locale: string; page: string } }
  | { ok: false; error: FeedbackError; /** Pretend success so bots learn nothing. */ silent?: boolean };

// C0/C1 control characters except tab and newline.
const CONTROL = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;

function clean(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').replace(CONTROL, '').trim() : '';
}

export function validateFeedback(body: unknown, now: number = Date.now()): ValidationResult {
  if (!body || typeof body !== 'object') return { ok: false, error: 'invalid' };
  const b = body as Record<string, unknown>;

  if (clean(b.website) !== '') return { ok: false, error: 'invalid', silent: true };

  const startedAt = typeof b.startedAt === 'number' ? b.startedAt : NaN;
  const elapsed = now - startedAt;
  if (!Number.isFinite(elapsed) || elapsed > FEEDBACK_LIMITS.maxFillMs) return { ok: false, error: 'invalid' };
  if (elapsed < FEEDBACK_LIMITS.minFillMs) return { ok: false, error: 'tooFast' };

  const name = clean(b.name).replace(/\s+/g, ' ');
  const message = clean(b.message);
  if (!message) return { ok: false, error: 'empty' };
  if (name.length > FEEDBACK_LIMITS.name || message.length > FEEDBACK_LIMITS.message) {
    return { ok: false, error: 'tooLong' };
  }

  const locale = isLocale(b.locale) ? b.locale : defaultLocale;
  const page = clean(b.page).slice(0, FEEDBACK_LIMITS.page);
  return { ok: true, value: { name, message, locale, page } };
}

/** Discord webhook body. Mentions are disabled so @everyone etc. stay plain text. */
export function discordMessage(
  value: { name: string; message: string; locale: string; page: string },
  userAgent: string,
) {
  const fields = [{ name: 'Locale', value: value.locale, inline: true }];
  if (value.page) fields.push({ name: 'From', value: value.page, inline: true });
  if (userAgent) fields.push({ name: 'Browser', value: userAgent.slice(0, 300), inline: false });
  return {
    username: 'printmd feedback',
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title: '새 의견',
        author: { name: value.name || '(이름 없음)' },
        description: value.message,
        color: 0x2563eb,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Fixed-window request counter per key (the client IP). In memory, so each
 * server instance counts on its own and restarts reset it — enough to slow
 * down a single script, not a determined attacker.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function allow(key: string, now: number = Date.now()): boolean {
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count += 1;
    return true;
  };
}
