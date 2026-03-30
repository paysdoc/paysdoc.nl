CREATE TABLE IF NOT EXISTS projects (
  id TEXT NOT NULL PRIMARY KEY,
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
