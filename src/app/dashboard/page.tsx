import type { Metadata } from 'next';
import { auth } from '@/auth';
import { listRepos } from './actions';
import AddRepoForm from './AddRepoForm';
import RepoList from './RepoList';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  const repos = await listRepos();

  return (
    <div className="min-h-[calc(100vh-8rem)] px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Repositories</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Logged in as{' '}
            <span className="text-[var(--accent)]">{session?.user?.email}</span>
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Add Repository
          </h2>
          <AddRepoForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Registered Repositories
          </h2>
          <RepoList repos={repos} />
        </section>

        <div className="rounded-md border border-[var(--border)] bg-[var(--foreground)]/5 px-4 py-3 text-sm text-[var(--muted)]">
          More functionality coming soon.
        </div>
      </div>
    </div>
  );
}
