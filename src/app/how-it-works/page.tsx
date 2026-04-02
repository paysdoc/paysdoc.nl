import type { Metadata } from 'next';
import InterestForm from '@/components/InterestForm';

export const metadata: Metadata = {
  title: 'How It Works',
};

const phases = [
  {
    number: '01',
    title: 'Collaborative Onboarding',
    description:
      'We start by getting to know your business, your goals, and what you want to build. Through a structured discovery process, we capture your requirements in plain language — no technical background needed. You stay in the driving seat from day one.',
  },
  {
    number: '02',
    title: 'AI-Driven Development',
    description:
      'Once we have a shared understanding of what needs to be built, AI takes on the heavy lifting of writing the code. An experienced engineer guides the process at every step, reviewing the work and steering the AI toward your specific needs.',
  },
  {
    number: '03',
    title: 'Expert Quality Assurance',
    description:
      'Every deliverable is reviewed by a senior developer with nearly 30 years of experience before it reaches you. This human oversight ensures the software is reliable, maintainable, and truly fit for purpose — not just functional on paper.',
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="mb-16 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">
          Coming Soon
        </p>
        <h1 className="text-4xl font-bold mb-6">
          How AI-Powered Development Works
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed">
          We are building a new way to develop software — one that pairs the
          speed of AI with the judgement of experienced engineers. The result is
          faster, more affordable software development without sacrificing
          quality or control.
        </p>
        <p className="text-[var(--muted)] mt-4 leading-relaxed">
          This service is not yet open to the public. We are running a small
          pilot with a handful of early partners. If you are curious, read on
          and register your interest below.
        </p>
      </div>

      {/* Three Phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {phases.map((phase) => (
          <div
            key={phase.number}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-8"
          >
            <p className="text-3xl font-bold text-[var(--accent)] mb-4">
              {phase.number}
            </p>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              {phase.title}
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              {phase.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-[var(--border)] pt-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-3">Interested in the pilot?</h2>
          <p className="text-[var(--muted)] mb-8">
            We will reach out personally when we open the next round of
            onboarding. Leave your email and we will be in touch.
          </p>
          <InterestForm />
        </div>
      </div>
    </div>
  );
}
