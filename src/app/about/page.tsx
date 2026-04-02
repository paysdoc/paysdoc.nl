import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About — Martin Koster',
  description:
    'Martin Koster — full-stack developer and consultant with nearly 30 years of experience across banking, retail, energy, government, and airline industries.',
};

const industries = [
  {
    sector: 'Banking',
    icon: '🏦',
    highlights: [
      { client: 'BMG / ING', description: 'Payments systems development for one of the Netherlands\' largest banking groups.' },
      { client: 'ABSA', description: 'Banking solutions for a leading South African financial institution.' },
    ],
  },
  {
    sector: 'Retail',
    icon: '👟',
    highlights: [
      { client: 'Nike EMEA', description: 'Business intelligence and reporting solutions supporting retail operations across Europe, the Middle East, and Africa.' },
    ],
  },
  {
    sector: 'Energy',
    icon: '⚡',
    highlights: [
      { client: 'Alliander', description: 'Infrastructure migration and modernisation for a major Dutch energy network operator.' },
    ],
  },
  {
    sector: 'Government',
    icon: '🏛️',
    highlights: [
      { client: 'Ministry of Infrastructure and Water Management', description: 'Systems modernisation for a Dutch central government ministry.' },
    ],
  },
  {
    sector: 'Airline',
    icon: '✈️',
    highlights: [
      { client: 'Airline industry', description: 'Software delivery for passenger services and operational systems.' },
    ],
  },
];

const techGroups = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Java'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next.js'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Spring Boot'],
  },
  {
    label: 'Practices',
    items: ['Test-driven development', 'System architecture', 'Technical consulting'],
  },
];

const languages = [
  { name: 'English', level: 'Native' },
  { name: 'Dutch', level: 'Native' },
  { name: 'German', level: 'Professional' },
  { name: 'Afrikaans', level: 'Professional' },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
        <div className="shrink-0">
          <Image
            src="/images/headshot.jpg"
            alt="Martin Koster"
            width={160}
            height={160}
            className="rounded-full border-4 border-[var(--border)] object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Martin Koster</h1>
          <p className="text-[var(--accent)] font-semibold text-lg mb-4">
            Full-Stack Developer &amp; Consultant
          </p>
          <p className="text-[var(--muted)] leading-relaxed max-w-2xl">
            With nearly 30 years of full-stack development experience, I help
            organisations solve complex software challenges. I have worked across
            banking, retail, energy, government, and airline industries —
            delivering robust, maintainable systems that stand the test of time.
          </p>
        </div>
      </div>

      {/* Industries & Project Highlights */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Industries &amp; Project Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industries.map(({ sector, icon, highlights }) => (
            <div
              key={sector}
              className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-lg font-semibold">{sector}</h3>
              </div>
              <ul className="space-y-3">
                {highlights.map(({ client, description }) => (
                  <li key={client}>
                    <span className="font-medium text-[var(--foreground)]">{client}</span>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Expertise */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Technology Expertise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techGroups.map(({ label, items }) => (
            <div key={label} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
              <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-3">
                {label}
              </h3>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="text-sm text-[var(--muted)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <h2 className="text-2xl font-bold mb-8">Languages</h2>
        <div className="flex flex-wrap gap-4">
          {languages.map(({ name, level }) => (
            <div
              key={name}
              className="px-5 py-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)]"
            >
              <span className="font-medium">{name}</span>
              <span className="text-sm text-[var(--muted)] ml-2">— {level}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
