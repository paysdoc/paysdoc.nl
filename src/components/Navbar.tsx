'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-simpel.png" alt="Paysdoc logo" width={32} height={32} />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-widest uppercase">PAYSDOC</span>
            <span className="text-xs text-[var(--muted)]">consultancy</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href
                  ? 'text-[var(--accent)] font-medium'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {label}
            </Link>
          ))}

          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'avatar'}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                    {(session.user.name ?? session.user.email ?? '?')[0].toUpperCase()}
                  </span>
                )}
                <span>{session.user.name}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-[var(--border)] bg-[var(--background)] py-1 shadow-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
