import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, discordMessage, validateFeedback, type FeedbackError } from '@/lib/feedback/submit';

// 5 messages per IP every 10 minutes.
const allow = createRateLimiter(5, 10 * 60 * 1000);

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function fail(error: FeedbackError, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('[feedback] DISCORD_FEEDBACK_WEBHOOK_URL is not set');
    return fail('server', 500);
  }

  if (!allow(clientIp(request))) return fail('rateLimited', 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail('invalid', 400);
  }

  const result = validateFeedback(body);
  if (!result.ok) {
    if (result.silent) return NextResponse.json({ ok: true });
    return fail(result.error, 400);
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage(result.value, request.headers.get('user-agent') ?? '')),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('[feedback] Discord responded', res.status, await res.text().catch(() => ''));
      return fail('server', 502);
    }
  } catch (err) {
    console.error('[feedback] Discord request failed', err);
    return fail('server', 502);
  }

  return NextResponse.json({ ok: true });
}
