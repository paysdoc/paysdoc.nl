interface SecretStoreSecret {
  get(): Promise<string>;
}

interface CloudflareEnv {
  DB: D1Database;
  AUTH_SECRET: SecretStoreSecret;
  AUTH_GOOGLE_ID: SecretStoreSecret;
  AUTH_GOOGLE_SECRET: SecretStoreSecret;
  AUTH_GITHUB_ID: SecretStoreSecret;
  AUTH_GITHUB_SECRET: SecretStoreSecret;
  COST_API_TOKEN: SecretStoreSecret;
  // Vars (plain strings, not secrets)
  EMAIL_WORKER_URL: string;
  COST_API_URL: string;
}
