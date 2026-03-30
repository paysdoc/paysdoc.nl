export function parseRepoUrl(
  url: string
): { provider: 'github' | 'gitlab'; name: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const { hostname, pathname } = parsed;

  // Strip leading slash, trailing slash, and split into segments
  const segments = pathname
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/')
    .map((s) => s.replace(/\.git$/, ''));

  if (hostname === 'github.com') {
    if (segments.length < 2 || !segments[0] || !segments[1]) return null;
    return { provider: 'github', name: `${segments[0]}/${segments[1]}` };
  }

  if (hostname === 'gitlab.com') {
    const cleaned = segments.filter(Boolean);
    if (cleaned.length < 2) return null;
    return { provider: 'gitlab', name: cleaned.join('/') };
  }

  return null;
}
