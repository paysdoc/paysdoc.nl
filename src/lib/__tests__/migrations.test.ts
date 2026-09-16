import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { D1Adapter } from '@auth/d1-adapter';

// node:sqlite is built into Node >= 22.13 but @types/node@20 has no typings for it,
// so load it through require() and give it a minimal local type.
type SqliteDb = {
  exec(sql: string): void;
  prepare(sql: string): {
    all(...params: unknown[]): Record<string, unknown>[];
    get(...params: unknown[]): Record<string, unknown> | undefined;
    run(...params: unknown[]): unknown;
  };
};
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as {
  DatabaseSync: new (filename: string) => SqliteDb;
};

const migrationsDir = path.resolve(__dirname, '../../../migrations');

function loadMigrations(): { name: string; sql: string }[] {
  return fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((name) => ({ name, sql: fs.readFileSync(path.join(migrationsDir, name), 'utf8') }));
}

// Mirrors `wrangler d1 migrations apply`: each file runs exactly once, tracked in d1_migrations.
// (SQLite has no ADD COLUMN IF NOT EXISTS, so ALTER migrations rely on this bookkeeping.)
function applyAll(db: SqliteDb): void {
  db.exec(`CREATE TABLE IF NOT EXISTS d1_migrations (name TEXT PRIMARY KEY)`);
  const applied = new Set(db.prepare(`SELECT name FROM d1_migrations`).all().map((r) => r.name as string));
  for (const m of loadMigrations()) {
    if (applied.has(m.name)) continue;
    db.exec(m.sql);
    db.prepare(`INSERT INTO d1_migrations (name) VALUES (?)`).run(m.name);
  }
}

// Minimal D1 database over node:sqlite covering what @auth/d1-adapter's helpers call:
// prepare(sql).bind(...args).run() and .first()
type D1Like = Parameters<typeof D1Adapter>[0];
function asD1(db: SqliteDb): D1Like {
  const statement = (sql: string, params: unknown[]) => ({
    bind: (...next: unknown[]) => statement(sql, next),
    run: async () => {
      db.prepare(sql).run(...params);
      return { success: true, results: [], meta: {} };
    },
    first: async () => db.prepare(sql).get(...params) ?? null,
    all: async () => ({ success: true, results: db.prepare(sql).all(...params), meta: {} }),
  });
  return { prepare: (sql: string) => statement(sql, []) } as unknown as D1Like;
}

function tableNames(db: SqliteDb): string[] {
  return db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> 'd1_migrations' ORDER BY name`)
    .all()
    .map((r) => r.name as string);
}

function columns(db: SqliteDb, table: string): string[] {
  return db.prepare(`PRAGMA table_info(${table})`).all().map((r) => r.name as string);
}

describe('D1 migrations', () => {
  let db: SqliteDb;

  beforeAll(() => {
    db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON');
    applyAll(db);
  });

  it('are numbered sequentially starting at 0001', () => {
    const names = loadMigrations().map((m) => m.name);
    expect(names.length).toBeGreaterThanOrEqual(4);
    names.forEach((name, i) => {
      expect(name).toMatch(new RegExp(`^${String(i + 1).padStart(4, '0')}_[a-z0-9_]+\\.sql$`));
    });
  });

  it('create the Auth.js tables and the dashboard/cost tables', () => {
    expect(tableNames(db)).toEqual([
      'accounts',
      'client_repos',
      'cost_records',
      'projects',
      'sessions',
      'token_usage',
      'users',
      'verification_tokens',
    ]);
  });

  it('are idempotent: applying them twice is a no-op', () => {
    expect(() => applyAll(db)).not.toThrow();
    expect(tableNames(db)).toHaveLength(8);
  });

  it('only define each table once across all files', () => {
    const created = loadMigrations().flatMap((m) =>
      [...m.sql.matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/g)].map((match) => match[1])
    );
    expect(new Set(created).size).toBe(created.length);
  });

  it('use IF NOT EXISTS on every CREATE statement', () => {
    for (const m of loadMigrations()) {
      const creates = m.sql.match(/CREATE (?:UNIQUE )?(?:TABLE|INDEX)\b[^\n]*/g) ?? [];
      const alters = m.sql.match(/ALTER TABLE\b[^\n]*/g) ?? [];
      expect(creates.length + alters.length).toBeGreaterThan(0);
      for (const stmt of creates) expect(stmt).toContain('IF NOT EXISTS');
    }
  });

  it('expose the columns queried by src/app/dashboard/actions.ts', () => {
    expect(columns(db, 'client_repos')).toEqual(
      expect.arrayContaining(['id', 'user_id', 'repo_url', 'repo_name', 'provider', 'project_id', 'created_at'])
    );
    expect(columns(db, 'projects')).toEqual(expect.arrayContaining(['id', 'name', 'repo_url']));
  });

  it('expose the columns queried by src/lib/costs.ts', () => {
    expect(columns(db, 'projects')).toEqual(expect.arrayContaining(['id', 'name']));
    expect(columns(db, 'cost_records')).toEqual(
      expect.arrayContaining(['id', 'project_id', 'issue_number', 'model', 'provider', 'amount_usd', 'created_at'])
    );
    expect(columns(db, 'token_usage')).toEqual(
      expect.arrayContaining(['id', 'cost_record_id', 'token_type', 'count'])
    );
  });

  it('support the dashboard join and the cost aggregation queries', () => {
    db.prepare(`INSERT INTO users (id, email) VALUES (?, ?)`).run('u1', 'user@example.com');
    db.prepare(`INSERT INTO projects (name, repo_url) VALUES (?, ?)`).run('Demo', 'https://github.com/acme/demo');
    const project = db
      .prepare(`SELECT id FROM projects WHERE repo_url = ?`)
      .get('https://github.com/acme/demo') as { id: number };
    expect(project.id).toBe(1);

    db.prepare(
      `INSERT INTO client_repos (id, user_id, repo_url, repo_name, provider, project_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run('r1', 'u1', 'https://github.com/acme/demo', 'acme/demo', 'github', project.id);

    db.prepare(
      `INSERT INTO cost_records (project_id, issue_number, model, provider, amount_usd) VALUES (?, ?, ?, ?, ?)`
    ).run(project.id, 7, 'claude-sonnet-5', 'anthropic', 1.5);
    db.prepare(`INSERT INTO token_usage (cost_record_id, token_type, count) VALUES (?, ?, ?)`).run(1, 'input', 10);

    // listRepos() in actions.ts
    const repos = db
      .prepare(
        `SELECT cr.*, p.name AS project_name
         FROM client_repos cr
         LEFT JOIN projects p ON cr.project_id = p.id
         WHERE cr.user_id = ?
         ORDER BY cr.created_at DESC`
      )
      .all('u1');
    expect(repos).toHaveLength(1);
    expect(repos[0].project_name).toBe('Demo');

    // getModelProviderBreakdown() / getIssueCostDetails() in costs.ts
    const breakdown = db
      .prepare(
        `SELECT model, provider, SUM(amount_usd) AS total_cost
         FROM cost_records WHERE project_id = ? GROUP BY model, provider ORDER BY total_cost DESC`
      )
      .all(project.id);
    expect(breakdown).toEqual([{ model: 'claude-sonnet-5', provider: 'anthropic', total_cost: 1.5 }]);

    const tokens = db
      .prepare(
        `SELECT token_type, SUM(count) AS total_count
         FROM token_usage WHERE cost_record_id IN (?) GROUP BY token_type ORDER BY token_type ASC`
      )
      .all(1);
    expect(tokens).toEqual([{ token_type: 'input', total_count: 10 }]);
  });

  it('let @auth/d1-adapter link a Google OAuth2 account (regression: missing oauth_token columns)', async () => {
    expect(columns(db, 'accounts')).toEqual(expect.arrayContaining(['oauth_token', 'oauth_token_secret']));

    const adapter = D1Adapter(asD1(db));
    const user = await adapter.createUser!({
      id: 'ignored-by-adapter',
      name: 'Paysdoc',
      email: 'oauth@example.com',
      emailVerified: null,
      image: null,
    });
    expect(user.email).toBe('oauth@example.com');

    // The exact shape Auth.js passes for an OIDC provider: no OAuth 1.0a fields present.
    await expect(
      adapter.linkAccount!({
        userId: user.id,
        type: 'oidc',
        provider: 'google',
        providerAccountId: '1234567890',
        access_token: 'ya29.token',
        expires_at: 1_800_000_000,
        token_type: 'bearer',
        scope: 'openid profile email',
        id_token: 'eyJ.header.payload',
      })
    ).resolves.toBeDefined();

    const linked = await adapter.getUserByAccount!({ provider: 'google', providerAccountId: '1234567890' });
    expect(linked?.id).toBe(user.id);
  });

  it('reject an unknown client_repos provider', () => {
    expect(() =>
      db
        .prepare(
          `INSERT INTO client_repos (id, user_id, repo_url, repo_name, provider) VALUES (?, ?, ?, ?, ?)`
        )
        .run('r2', 'u1', 'https://bitbucket.org/a/b', 'a/b', 'bitbucket')
    ).toThrow();
  });
});
