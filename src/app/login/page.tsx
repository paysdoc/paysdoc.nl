import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';

export const metadata: Metadata = { title: 'Login' };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Sign in to paysdoc.nl
        </h1>
        <div className="flex flex-col gap-3">
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: '/dashboard' });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--foreground)]/5"
            >
              Sign in with Google
            </button>
          </form>
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: '/dashboard' });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--foreground)]/5"
            >
              Sign in with GitHub
            </button>
          </form>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--foreground)]/40">or</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <form
          action={async (formData: FormData) => {
            'use server';
            await signIn('email', {
              email: formData.get('email') as string,
              redirectTo: '/dashboard',
            });
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--foreground)]/40"
          />
          <button
            type="submit"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--foreground)]/5"
          >
            Send magic link
          </button>
        </form>
      </div>
    </div>
  );
}
