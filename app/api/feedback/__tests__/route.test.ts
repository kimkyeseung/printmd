// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const WEBHOOK = 'https://discord.test/api/webhooks/1/abc';

function request(body: unknown, ip = '1.2.3.4') {
  return new NextRequest('http://localhost/api/feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'user-agent': 'TestUA' },
    body: JSON.stringify(body),
  });
}

const valid = () => ({ name: 'Kim', message: 'Hello @everyone', website: '', startedAt: Date.now() - 5000, locale: 'ko', page: '/ko' });

describe('POST /api/feedback', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('DISCORD_FEEDBACK_WEBHOOK_URL', WEBHOOK);
    fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('forwards a valid message to the webhook with mentions disabled', async () => {
    const { POST } = await import('../route');
    const res = await POST(request(valid()));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(WEBHOOK);
    const sent = JSON.parse(init.body);
    expect(sent.allowed_mentions).toEqual({ parse: [] });
    expect(sent.embeds[0].description).toBe('Hello @everyone');
    expect(sent.embeds[0].author.name).toBe('Kim');
  });

  it('pretends to accept a honeypot hit without calling Discord', async () => {
    const { POST } = await import('../route');
    const res = await POST(request({ ...valid(), website: 'spam' }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a too-fast submission', async () => {
    const { POST } = await import('../route');
    const res = await POST(request({ ...valid(), startedAt: Date.now() }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'tooFast' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('limits requests per IP', async () => {
    const { POST } = await import('../route');
    for (let i = 0; i < 5; i++) expect((await POST(request(valid(), '9.9.9.9'))).status).toBe(200);
    expect((await POST(request(valid(), '9.9.9.9'))).status).toBe(429);
    expect((await POST(request(valid(), '8.8.8.8'))).status).toBe(200);
  });

  it('reports a server error when Discord is unreachable', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { POST } = await import('../route');
    const res = await POST(request(valid()));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'server' });
  });

  it('fails closed when the webhook URL is not configured', async () => {
    vi.stubEnv('DISCORD_FEEDBACK_WEBHOOK_URL', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { POST } = await import('../route');
    expect((await POST(request(valid()))).status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
