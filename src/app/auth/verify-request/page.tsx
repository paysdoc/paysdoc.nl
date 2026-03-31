import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Check your email' };

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="text-sm text-[var(--foreground)]/60">
          A magic link has been sent to your email address. Click the link to
          sign in — it expires in 24 hours and can only be used once.
        </p>
      </div>
    </div>
  );
}
