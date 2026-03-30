import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { D1Adapter } from '@auth/d1-adapter';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { resolveRole } from '@/lib/roles';

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const { env } = await getCloudflareContext({ async: true });
  return {
    adapter: D1Adapter(env.DB),
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    ],
    session: { strategy: 'jwt' },
    pages: { signIn: '/login' },
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
        }
        return session;
      },
    },
  };
});
