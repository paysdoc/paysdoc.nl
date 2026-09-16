-- Cost tables read by /admin (src/lib/costs.ts). `projects` is defined in
-- 0002_client_repos.sql and is deliberately not redefined here.
--
-- Restores the cost half of the migration deleted in 75b5e16.

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
