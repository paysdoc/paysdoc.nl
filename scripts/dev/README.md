# Local dev fixtures
Files in this folder are local-only fixtures for the `wrangler`/OpenNext preview and are never applied to production; real schema changes belong in `migrations/`.
Apply with `npx wrangler d1 execute paysdoc-auth-db --local --file scripts/dev/local-dashboard-tables.sql` after `npx wrangler d1 migrations apply paysdoc-auth-db --local`.
