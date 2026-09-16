import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export type OAuthCredentials = {
  googleId: string;
  googleSecret: string;
  githubId: string;
  githubSecret: string;
};

/**
 * GitHub started sending `iss` on the OAuth callback (RFC 9207). Auth.js validates it
 * against the provider issuer; without an explicit value the check runs against a
 * placeholder and every GitHub sign-in fails with
 * "unexpected iss (issuer) response parameter value".
 */
export const GITHUB_ISSUER = 'https://github.com/login/oauth';

export function oauthProviders({ googleId, googleSecret, githubId, githubSecret }: OAuthCredentials) {
  return [
    Google({ clientId: googleId, clientSecret: googleSecret }),
    GitHub({ clientId: githubId, clientSecret: githubSecret, issuer: GITHUB_ISSUER }),
  ];
}
