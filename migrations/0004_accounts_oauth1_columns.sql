-- @auth/d1-adapter's linkAccount() always binds oauth_token and oauth_token_secret
-- (OAuth 1.0a fields) even for OAuth 2 providers. 0001_auth_tables.sql omitted them,
-- so the first Google/GitHub sign-in on production failed with
-- "table accounts has no column named oauth_token".
-- SQLite has no ADD COLUMN IF NOT EXISTS; wrangler's d1_migrations table guarantees
-- this file is applied exactly once.
ALTER TABLE accounts ADD COLUMN oauth_token TEXT;
ALTER TABLE accounts ADD COLUMN oauth_token_secret TEXT;
