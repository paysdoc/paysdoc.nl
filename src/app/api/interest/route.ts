import { getCloudflareContext } from '@opennextjs/cloudflare';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email =
    body && typeof body === 'object' && 'email' in body
      ? (body as { email: unknown }).email
      : undefined;

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Invalid or missing email' }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  await env.INTEREST_KV.put(
    email,
    JSON.stringify({ email, timestamp: new Date().toISOString() })
  );

  return Response.json({ success: true }, { status: 201 });
}
