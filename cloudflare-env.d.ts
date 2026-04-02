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
  // URL of the deployed email worker (e.g. https://paysdoc-email-worker.<account>.workers.dev)
  EMAIL_WORKER_URL: SecretStoreSecret;
}
