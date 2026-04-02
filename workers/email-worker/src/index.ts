interface Env {
  EMAIL_FROM: string;
  AUTH_SECRET: string;
  RESEND_API_KEY: string;
}

interface EmailRequestBody {
  to: string;
  url: string;
}

function buildHtmlEmail(to: string, url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to paysdoc.nl</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #e5e7eb;">
          <tr>
            <td>
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111827;">Sign in to paysdoc.nl</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;">
                Click the button below to sign in. This link expires in 24 hours and can only be used once.
              </p>
              <a href="${url}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:600;">
                Sign in
              </a>
              <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
                Or copy and paste this URL into your browser:<br />
                <a href="${url}" style="color:#6b7280;word-break:break-all;">${url}</a>
              </p>
              <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
                If you did not request this email, you can safely ignore it.<br />
                This email was sent to ${to}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildTextEmail(url: string): string {
  return `Sign in to paysdoc.nl\n\nClick this link to sign in (expires in 24 hours, single-use):\n\n${url}\n\nIf you did not request this email, you can safely ignore it.`;
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${env.AUTH_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    let body: EmailRequestBody;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
    }

    const { to, url } = body;

    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return new Response('Missing or invalid "to" field', { status: 400 });
    }
    if (!url || typeof url !== 'string') {
      return new Response('Missing or invalid "url" field', { status: 400 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `paysdoc.nl <${env.EMAIL_FROM}>`,
        to: [to],
        subject: 'Sign in to paysdoc.nl',
        text: buildTextEmail(url),
        html: buildHtmlEmail(to, url),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend error:', response.status, errorText);
      return new Response('Failed to send email', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  },
};

export default handler;
