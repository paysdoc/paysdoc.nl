-- Local-only fixture: tables queried by /dashboard (src/app/dashboard/actions.ts)
-- and /admin (src/lib/costs.ts) that are not part of migrations/.
--
-- Recovered from two deleted migrations (removed in 75b5e16):
--   git show e81ca4b:migrations/0002_client_repos.sql   (projects, client_repos)
--   git show a1739e7:migrations/0002_cost_tables.sql    (projects, cost_records, token_usage)
--
-- Both defined `projects`; this is the union of their columns. `id` is INTEGER
-- because src/types/cost.ts types it as a number and cost_records.project_id is
-- INTEGER. client_repos.project_id keeps its original TEXT type; SQLite compares
-- it to projects.id via numeric affinity, so the dashboard join still works.
--
-- NOT a production migration. Apply locally with:
--   npx wrangler d1 execute paysdoc-auth-db --local --file scripts/dev/local-dashboard-tables.sql

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

CREATE TABLE IF NOT EXISTS cost_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  issue_number INTEGER,
  model TEXT,
  provider TEXT,
  amount_usd REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS cost_records_project_id ON cost_records (project_id);
CREATE INDEX IF NOT EXISTS cost_records_issue_number ON cost_records (project_id, issue_number);

CREATE TABLE IF NOT EXISTS token_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cost_record_id INTEGER NOT NULL,
  token_type TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (cost_record_id) REFERENCES cost_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS token_usage_cost_record_id ON token_usage (cost_record_id);
