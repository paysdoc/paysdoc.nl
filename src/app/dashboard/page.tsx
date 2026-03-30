import type { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <p className="text-lg">
        Dashboard — you are logged in as{' '}
        <span className="font-medium text-[var(--accent)]">{session?.user?.email}</span>
      </p>
    </div>
  );
}
