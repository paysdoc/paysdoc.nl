'use client';

import { useFormStatus } from 'react-dom';
import { addRepo } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--foreground)]/5 disabled:opacity-50"
    >
      {pending ? 'Adding…' : 'Add Repository'}
    </button>
  );
}

export default function AddRepoForm() {
  return (
    <form action={addRepo} className="flex gap-3">
      <input
        type="url"
        name="url"
        required
        placeholder="https://github.com/owner/repo"
        className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      />
      <SubmitButton />
    </form>
  );
}
