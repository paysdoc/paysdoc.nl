interface CloudflareEnv {
  DB: D1Database;
  // URL of the deployed email worker (e.g. https://paysdoc-email-worker.<account>.workers.dev)
  EMAIL_WORKER_URL: string;
}
