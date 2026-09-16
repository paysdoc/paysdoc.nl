import { describe, it, expect, vi, beforeEach } from 'vitest';

// The route resolves its KV binding through @opennextjs/cloudflare's
// getCloudflareContext(), which only works inside the Workers runtime.
// Replace it with a fake that hands back an in-memory INTEREST_KV so the
// handler can run under plain Vitest/Node.
// vi.mock() is hoisted above every import, so the fakes it references must be
// hoisted too.
const { kvPut, getCloudflareContext } = vi.hoisted(() => {
  const kvPut = vi.fn<(key: string, value: string) => Promise<void>>().mockResolvedValue(undefined);
  const getCloudflareContext = vi.fn().mockResolvedValue({ env: { INTEREST_KV: { put: kvPut } } });
  return { kvPut, getCloudflareContext };
});

vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext }));

import { POST } from '@/app/api/interest/route';

function post(body: BodyInit): Promise<Response> {
  return POST(
    new Request('http://localhost/api/interest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })
  );
}

describe('POST /api/interest', () => {
  beforeEach(() => {
    kvPut.mockClear();
    getCloudflareContext.mockClear();
  });

  it('returns 400 for a body that is not valid JSON', async () => {
    const res = await post('not json');

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid JSON body' });
    expect(getCloudflareContext).not.toHaveBeenCalled();
    expect(kvPut).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid email', async () => {
    const res = await post(JSON.stringify({ email: 'not-an-email' }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid or missing email' });
    expect(kvPut).not.toHaveBeenCalled();
  });

  it('returns 400 when the email field is missing', async () => {
    const res = await post(JSON.stringify({ name: 'Jane' }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid or missing email' });
    expect(kvPut).not.toHaveBeenCalled();
  });

  it('returns 201 and stores the email under its own key for a valid email', async () => {
    const res = await post(JSON.stringify({ email: 'jane@example.com' }));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ success: true });

    expect(getCloudflareContext).toHaveBeenCalledWith({ async: true });
    expect(kvPut).toHaveBeenCalledTimes(1);

    const [key, value] = kvPut.mock.calls[0];
    expect(key).toBe('jane@example.com');
    const stored = JSON.parse(value) as { email: string; timestamp: string };
    expect(stored.email).toBe('jane@example.com');
    expect(new Date(stored.timestamp).toISOString()).toBe(stored.timestamp);
  });
});
