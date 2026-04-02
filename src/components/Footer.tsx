import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start justify-between gap-6 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-[var(--foreground)]">PAYSDOC consultancy</p>
          <p>v/d Wervestraat 31, 2274 VE Voorburg</p>
          <p>KVK 50250574</p>
        </div>
        <div className="flex gap-6">
          <Link href="https://www.linkedin.com/in/martinkoster" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
            LinkedIn
          </Link>
          <Link href="https://github.com/paysdoc" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
            GitHub
          </Link>
          <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
            Contact
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-4 text-xs text-[var(--muted)]">
        &copy; {new Date().getFullYear()} PAYSDOC consultancy. All rights reserved.
      </div>
    </footer>
  );
}
