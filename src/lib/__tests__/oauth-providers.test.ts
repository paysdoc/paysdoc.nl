import { describe, it, expect } from 'vitest';
import * as o from 'oauth4webapi';
import { oauthProviders, GITHUB_ISSUER } from '../oauth-providers';

const creds = { googleId: 'g-id', googleSecret: 'g-secret', githubId: 'gh-id', githubSecret: 'gh-secret' };

type Resolved = { id: string; clientId?: string; issuer?: string };

// Provider factories keep the user's options under `provider.options`; @auth/core merges them
// onto the provider defaults when the config is parsed. Mirror that merge here.
function resolve(provider: { options?: object }): Resolved {
  const { options, ...defaults } = provider;
  return { ...defaults, ...options } as Resolved;
}

// Replays the check @auth/core runs on GET /api/auth/callback/<provider>: for OAuth 2 providers
// with explicit endpoints it builds the authorization server from `provider.issuer` and hands the
// callback query to oauth4webapi.validateAuthResponse (the function that threw in production).
function validateCallback(provider: { issuer?: string; clientId?: string }, query: Record<string, string>) {
  const as = { issuer: provider.issuer ?? 'https://authjs.dev' } as o.AuthorizationServer;
  const client = { client_id: provider.clientId ?? '' } as o.Client;
  return o.validateAuthResponse(as, client, new URLSearchParams(query), o.skipStateCheck);
}

describe('oauthProviders', () => {
  const [google, github] = oauthProviders(creds).map(resolve);

  it('builds the Google and GitHub providers with the given credentials', () => {
    expect(google.id).toBe('google');
    expect(google.clientId).toBe('g-id');
    expect(github.id).toBe('github');
    expect(github.clientId).toBe('gh-id');
  });

  it('accepts the GitHub callback now that GitHub sends iss (RFC 9207)', () => {
    // Exact query GitHub sent on 2026-09-16 (code redacted).
    const params = validateCallback(github, { code: '44a815e97fa2a015c3b4', iss: 'https://github.com/login/oauth' });
    expect(params.get('code')).toBe('44a815e97fa2a015c3b4');
  });

  it('would still reject the GitHub callback without the explicit issuer (regression guard)', () => {
    expect(() =>
      validateCallback({ ...github, issuer: undefined }, { code: 'x', iss: 'https://github.com/login/oauth' })
    ).toThrow(/unexpected "iss"/);
    expect(github.issuer).toBe(GITHUB_ISSUER);
  });

  it('still accepts the Google callback, which carries its own iss', () => {
    expect(google.issuer).toBe('https://accounts.google.com');
    const params = validateCallback(google, { code: 'x', iss: 'https://accounts.google.com', scope: 'openid' });
    expect(params.get('code')).toBe('x');
  });
});
