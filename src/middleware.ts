import { auth } from '@/auth';
import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

// Typing the guard with the (request, event) signature selects next-auth's
// middleware overload of `auth()` rather than its route-handler overload.
type AuthMiddleware = (req: NextAuthRequest, event: NextFetchEvent) => ReturnType<NextMiddleware>;

const guard: AuthMiddleware = (req) => {
  const { pathname } = req.nextUrl;

  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/admin') && req.auth.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
};

// `auth` is created with NextAuth's lazy-config form (a config *function*, needed
// because the Cloudflare env is only available per request). In that form,
// `auth(guard)` is itself an async function: at runtime it returns a Promise
// that resolves to the middleware, even though its declared type is the plain
// `NextMiddleware`. Exporting that Promise directly makes Next.js throw
// "The Middleware file must export a function named `middleware`" on every
// matched request. `Promise.resolve` types it honestly and works whether
// next-auth returns the function synchronously or asynchronously.
const authMiddleware: Promise<NextMiddleware> = Promise.resolve(auth(guard));

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  return (await authMiddleware)(req, event);
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
