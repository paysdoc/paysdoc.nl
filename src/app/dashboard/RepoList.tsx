'use client';

import { removeRepo } from './actions';
import type { ClientRepo } from './actions';

export default function RepoList({ repos }: { repos: ClientRepo[] }) {
  if (repos.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">No repositories yet.</p>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {repos.map((repo) => (
        <li key={repo.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{repo.repo_name}</span>
              <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]">
                {repo.provider}
              </span>
            </div>
            <a
              href={repo.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-[var(--accent)] truncate hover:underline"
            >
              {repo.repo_url}
            </a>
            {repo.project_name && (
              <p className="text-xs text-[var(--muted)]">
                Linked project: <span className="text-[var(--foreground)]">{repo.project_name}</span>
              </p>
            )}
          </div>
          <form action={removeRepo}>
            <input type="hidden" name="repoId" value={repo.id} />
            <button
              type="submit"
              className="shrink-0 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
            >
              Remove
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
