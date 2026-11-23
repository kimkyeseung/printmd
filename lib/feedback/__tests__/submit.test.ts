import { describe, it, expect } from 'vitest';
import { createRateLimiter, discordMessage, validateFeedback, FEEDBACK_LIMITS } from '../submit';

const now = 1_000_000_000;
const base = { name: 'Kim', message: 'Hello', website: '', startedAt: now - 5000, locale: 'ko', page: '/ko' };

describe('validateFeedback', () => {
  it('accepts a normal submission', () => {
    expect(validateFeedback(base, now)).toEqual({
      ok: true,
      value: { name: 'Kim', message: 'Hello', locale: 'ko', page: '/ko' },
    });
  });

  it('silently rejects a filled honeypot', () => {
    expect(validateFeedback({ ...base, website: 'http://spam' }, now)).toEqual({ ok: false, error: 'invalid', silent: true });
  });

  it('rejects submissions sent too soon after the form appeared', () => {
    expect(validateFeedback({ ...base, startedAt: now - 1000 }, now)).toMatchObject({ ok: false, error: 'tooFast' });
  });

  it('rejects a missing or stale start time', () => {
    expect(validateFeedback({ ...base, startedAt: undefined }, now)).toMatchObject({ ok: false, error: 'invalid' });
    expect(validateFeedback({ ...base, startedAt: now - FEEDBACK_LIMITS.maxFillMs - 1 }, now)).toMatchObject({ ok: false });
  });

  it('requires a message and enforces length limits', () => {
    expect(validateFeedback({ ...base, message: '   ' }, now)).toMatchObject({ error: 'empty' });
    expect(validateFeedback({ ...base, message: 'a'.repeat(FEEDBACK_LIMITS.message + 1) }, now)).toMatchObject({ error: 'tooLong' });
    expect(validateFeedback({ ...base, name: 'a'.repeat(FEEDBACK_LIMITS.name + 1) }, now)).toMatchObject({ error: 'tooLong' });
  });

  it('allows an empty name and strips control characters', () => {
    const r = validateFeedback({ ...base, name: '', message: 'a\u0000b\r\nc' }, now);
    expect(r).toMatchObject({ ok: true, value: { name: '', message: 'ab\nc' } });
  });
});

describe('discordMessage', () => {
  it('disables mentions', () => {
    const msg = discordMessage({ name: '@everyone', message: '@here hi', locale: 'en', page: '' }, 'UA');
    expect(msg.allowed_mentions).toEqual({ parse: [] });
    expect(msg.embeds[0].description).toBe('@here hi');
  });
});

describe('createRateLimiter', () => {
  it('blocks after the limit until the window resets', () => {
    const allow = createRateLimiter(2, 1000);
    expect(allow('ip', 0)).toBe(true);
    expect(allow('ip', 1)).toBe(true);
    expect(allow('ip', 2)).toBe(false);
    expect(allow('other', 2)).toBe(true);
    expect(allow('ip', 1001)).toBe(true);
  });
});
