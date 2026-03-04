import type { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
};

const services = [
  {
    title: 'AI Development Workflow Setup',
    description:
      'Get ADW running on your repositories — fully automated issue-to-PR pipelines.',
    features: [
      'GitHub webhook integration with your repos',
      'Issue classification and routing',
      'Automated planning, building, and testing',
      'PR creation with review and documentation',
      'Custom workflow configuration per project',
    ],
  },
  {
    title: 'Custom Agent Development',
    description:
      'Purpose-built AI agents tailored to your development process.',
    features: [
      'Multi-agent orchestration pipelines',
      'Claude Code CLI integration',
      'Custom issue classifiers and workflow routers',
      'Automated code review agents',
      'CI/CD pipeline automation',
    ],
  },
  {
    title: 'TypeScript Architecture & Consulting',
    description:
      'Design and implementation of scalable TypeScript systems.',
    features: [
      'Modular monorepo architecture',
      'Type-safe API design',
      'Comprehensive test suite setup',
      'Performance optimization',
      'Code review and refactoring',
    ],
  },
];

export default function Services() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Services</h1>
      <p className="text-[var(--muted)] mb-12 max-w-2xl">
        AI-powered development solutions for teams that want to ship faster
        without sacrificing quality.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          Book a Discovery Call
        </Link>
      </div>
    </div>
  );
}
