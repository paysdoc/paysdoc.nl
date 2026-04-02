import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { D1Adapter } from '@auth/d1-adapter';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { resolveRole } from '@/lib/roles';
import type { EmailConfig } from '@auth/core/providers/email';

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const { env } = await getCloudflareContext({ async: true });
  const [emailWorkerUrl, authSecret, googleId, googleSecret, githubId, githubSecret] = await Promise.all([
    env.EMAIL_WORKER_URL.get(),
    env.AUTH_SECRET.get(),
    env.AUTH_GOOGLE_ID.get(),
    env.AUTH_GOOGLE_SECRET.get(),
    env.AUTH_GITHUB_ID.get(),
    env.AUTH_GITHUB_SECRET.get(),
  ]);

  const emailProvider: EmailConfig = {
    id: 'email',
    type: 'email',
    name: 'Email',
    from: 'noreply@paysdoc.nl',
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest({ identifier, url }) {
      if (!emailWorkerUrl) throw new Error('EMAIL_WORKER_URL is not set');
      const response = await fetch(emailWorkerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSecret}`,
        },
        body: JSON.stringify({ to: identifier, url }),
      });
      if (!response.ok) {
        throw new Error(`Email worker responded with ${response.status}`);
      }
    },
    options: {},
  };

  return {
    adapter: D1Adapter(env.DB),
    providers: [
      Google({
        clientId: googleId,
        clientSecret: googleSecret,
      }),
      GitHub({
        clientId: githubId,
        clientSecret: githubSecret,
      }),
      emailProvider,
    ],
    session: { strategy: 'jwt' },
    pages: { signIn: '/login', verifyRequest: '/auth/verify-request' },
    callbacks: {
      jwt({ token, user }) {
        if (user?.email) {
          token.role = resolveRole(user.email);
        }
        return token;
      },
      session({ session, token }) {
        if (session.user) {
          session.user.role = token.role as 'admin' | 'client';
          session.user.id = token.sub!;
        }
        return session;
      },
    },
  };
});
