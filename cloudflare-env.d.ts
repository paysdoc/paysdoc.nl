interface CloudflareEnv {
  DB: D1Database;
  INTEREST_KV: KVNamespace;
  AUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  AUTH_GITHUB_ID: string;
  AUTH_GITHUB_SECRET: string;
  COST_API_TOKEN: string;
  EMAIL_WORKER_URL: string;
  COST_API_URL: string;
}
