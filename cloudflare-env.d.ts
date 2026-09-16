interface CloudflareEnv {
  DB: D1Database;
  INTEREST_KV: KVNamespace;
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  // Secrets (plain strings, set via `wrangler secret put` / GitHub Actions)
  AUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  AUTH_GITHUB_ID: string;
  AUTH_GITHUB_SECRET: string;
  COST_API_TOKEN: string;
  // Vars (plain strings, not secrets)
  EMAIL_WORKER_URL: string;
  COST_API_URL: string;
}
