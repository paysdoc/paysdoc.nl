-- Dashboard tables: projects (matched by repo_url) and the repos a signed-in
-- user has registered on /dashboard (src/app/dashboard/actions.ts).
--
-- Restores the migration deleted in 75b5e16. `projects.id` is INTEGER (not the
-- original TEXT) so it agrees with cost_records.project_id in 0003 and with
-- ProjectRow.id: number in src/types/cost.ts. client_repos.project_id keeps its
-- TEXT type; SQLite's numeric affinity still makes the LEFT JOIN match.

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  repo_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS projects_repo_url ON projects (repo_url);

CREATE TABLE IF NOT EXISTS client_repos (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'gitlab')),
  project_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS client_repos_user_id_repo_url ON client_repos (user_id, repo_url);
