import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">About</h1>

      <div className="space-y-6 text-[var(--muted)] leading-relaxed">
        <p>
          I build autonomous software development systems. My flagship project,
          the <strong className="text-[var(--foreground)]">AI Developer Workflow (ADW)</strong>,
          turns GitHub issues into production-ready pull requests — planning,
          coding, testing, reviewing, and documenting without manual intervention.
        </p>

        <p>
          ADW is built on a modular TypeScript architecture with composable
          workflow phases. Each phase — planning, building, testing, reviewing,
          documenting — is an independent agent that can run alone or be
          orchestrated into complete SDLC pipelines.
        </p>

        <h2 className="text-xl font-semibold text-[var(--foreground)] pt-4">
          Philosophy
        </h2>
        <p>
          Software development has predictable patterns. Issue triage, branch
          creation, implementation planning, test writing, code review, and
          documentation follow repeatable workflows. By encoding these patterns
          into AI agents, I eliminate the mechanical overhead and let developers
          focus on architecture and product decisions.
        </p>

        <h2 className="text-xl font-semibold text-[var(--foreground)] pt-4">
          Open Source
        </h2>
        <p>
          The core ADW system is developed in the open at{' '}
          <a
            href="https://github.com/paysdoc"
            className="text-[var(--accent)] hover:underline"
          >
            github.com/paysdoc
          </a>
          . I believe that the tools shaping how we write software should be
          transparent and community-driven.
        </p>
      </div>
    </div>
  );
}
