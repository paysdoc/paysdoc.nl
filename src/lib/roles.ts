const ADMIN_EMAILS = ['paysdoc@gmail.com', 'martin@paysdoc.nl'];

export type Role = 'admin' | 'client';

export function resolveRole(email: string | null | undefined): Role {
  if (!email) return 'client';
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'client';
}
