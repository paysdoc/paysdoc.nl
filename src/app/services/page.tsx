import type { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';

export const metadata: Metadata = {
  title: 'Services',
};

const services = [
  {
    title: 'AI-Powered Development',
    badge: 'Coming Soon — Pilot',
    badgeVariant: 'pilot' as const,
    description:
      'Your application built by artificial intelligence, with an experienced engineer overseeing every step to ensure quality and minimise technical debt.',
    features: [
      'Your application built by AI, guided by an experienced engineer',
      'Quality oversight at every step — no corners cut',
      'Reduced pilot rate for early adopters',
      'Faster delivery without sacrificing reliability',
    ],
    ctaText: 'Register your interest',
    ctaHref: '/contact',
  },
  {
    title: 'Full-Stack Consulting',
    badge: 'Available Now',
    badgeVariant: 'available' as const,
    description:
      'Nearly 30 years of hands-on experience delivering software solutions across some of the world\'s most demanding industries.',
    features: [
      'Nearly 30 years of software engineering experience',
      'Proven track record in banking, retail, energy, and government',
      'Full project lifecycle — from architecture to delivery',
      'TypeScript, Java, React, and modern web technologies',
    ],
    ctaText: 'Get in touch',
    ctaHref: '/contact',
  },
];

const industries = ['Banking', 'Retail', 'Energy', 'Government', 'Airline'];

export default function Services() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Our Services</h1>
      <p className="text-[var(--muted)] mb-12 max-w-2xl">
        Whether you&apos;re looking for cutting-edge AI-powered development or
        seasoned consulting expertise, we have the right solution for your
        project.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Industries We&apos;ve Worked In</h2>
        <p className="text-[var(--muted)] mb-6">
          Our track record spans some of the most regulated and complex sectors,
          giving us the experience to handle your project with confidence.
        </p>
        <div className="flex flex-wrap gap-3">
          {industries.map((industry) => (
            <span
              key={industry}
              className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm font-medium"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
