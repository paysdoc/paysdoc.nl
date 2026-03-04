import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <p>&copy; {new Date().getFullYear()} paysdoc.nl. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="https://github.com/paysdoc" className="hover:text-[var(--foreground)] transition-colors">
            GitHub
          </Link>
          <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
