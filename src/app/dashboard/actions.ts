'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { parseRepoUrl } from '@/lib/repo-url';

export type ClientRepo = {
  id: string;
  user_id: string;
  repo_url: string;
  repo_name: string;
  provider: 'github' | 'gitlab';
  project_id: string | null;
  project_name: string | null;
  created_at: string;
};

export async function listRepos(): Promise<ClientRepo[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    `SELECT cr.*, p.name as project_name
     FROM client_repos cr
     LEFT JOIN projects p ON cr.project_id = p.id
     WHERE cr.user_id = ?
     ORDER BY cr.created_at DESC`
  )
    .bind(session.user.id)
    .all<ClientRepo>();

  return result.results;
}

export async function addRepo(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const url = (formData.get('url') as string | null)?.trim() ?? '';
  const parsed = parseRepoUrl(url);
  if (!parsed) {
    throw new Error('Invalid GitHub or GitLab URL');
  }

  const { env } = await getCloudflareContext({ async: true });

  const matchResult = await env.DB.prepare(
    `SELECT id FROM projects WHERE repo_url = ?`
  )
    .bind(url)
    .first<{ id: string }>();

  const projectId = matchResult?.id ?? null;

  await env.DB.prepare(
    `INSERT INTO client_repos (id, user_id, repo_url, repo_name, provider, project_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      session.user.id,
      url,
      parsed.name,
      parsed.provider,
      projectId
    )
    .run();

  revalidatePath('/dashboard');
}

export async function removeRepo(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const repoId = formData.get('repoId') as string | null;
  if (!repoId) return;

  const { env } = await getCloudflareContext({ async: true });
  await env.DB.prepare(
    `DELETE FROM client_repos WHERE id = ? AND user_id = ?`
  )
    .bind(repoId, session.user.id)
    .run();

  revalidatePath('/dashboard');
}
