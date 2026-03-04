import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        AI-Powered Software Development
      </h1>
      <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-10">
        Autonomous development workflows that plan, build, test, review, and
        document — from GitHub issue to production-ready pull request.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/contact"
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          Book a Discovery Call
        </Link>
        <Link
          href="/services"
          className="px-6 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--card-bg)] transition-colors"
        >
          View Services
        </Link>
      </div>
    </section>
  );
}
