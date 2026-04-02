import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Martin Koster',
  description:
    'Nearly 30 years of full-stack development experience across banking, retail, energy, government, and airline industries.',
};

const industries = [
  {
    name: 'Banking',
    highlights: [
      'Payments systems and financial infrastructure at BMG/ING',
      'Core banking and digital channels at ABSA',
    ],
  },
  {
    name: 'Retail',
    highlights: [
      'Business intelligence and data platforms at Nike EMEA',
      'Reporting and analytics to support commercial decision-making',
    ],
  },
  {
    name: 'Energy',
    highlights: [
      'Infrastructure migration and modernisation at Alliander',
      'Large-scale system transitions with minimal disruption to operations',
    ],
  },
  {
    name: 'Government',
    highlights: [
      'Systems modernisation at the Ministry of Infrastructure and Water Management',
      'Replacing legacy platforms with maintainable, standards-compliant solutions',
    ],
  },
  {
    name: 'Airline',
    highlights: [
      'Operational systems supporting flight and logistics workflows',
      'High-availability platforms where reliability is critical',
    ],
  },
];

const techGroups = [
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Java'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Spring Boot'],
  },
  {
    category: 'Broader capabilities',
    items: ['Cloud platforms', 'Relational and NoSQL databases', 'Automated build and release tooling'],
  },
];

const languages = ['English', 'German', 'Dutch', 'Afrikaans'];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">

      {/* Hero / Introduction */}
      <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
        <div className="flex-shrink-0">
          <Image
            src="/images/headshot.jpg"
            alt="Martin Koster — Full-Stack Developer & Consultant"
            width={200}
            height={200}
            className="rounded-full object-cover border border-[var(--border)]"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Martin Koster</h1>
          <p className="text-[var(--accent)] font-medium text-lg mb-4">
            Full-Stack Developer &amp; Consultant
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            With nearly 30 years of full-stack development experience, I help
            organisations build and modernise the software that runs their
            business. I have worked with teams of all sizes — from early-stage
            startups to large enterprise programmes — across banking, retail,
            energy, government, and airline industries.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mt-4">
            My focus is on delivering software that is reliable, maintainable,
            and fit for purpose. I engage at the level the project needs:
            hands-on development, technical leadership, or advisory input.
          </p>
        </div>
      </div>

      {/* Industries & Project Highlights */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">Industries &amp; Experience</h2>
        <p className="text-[var(--muted)] mb-8">
          A selection of industries and organisations I have worked with over the years.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]"
            >
              <h3 className="text-lg font-semibold mb-4">{industry.name}</h3>
              <ul className="space-y-2">
                {industry.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">&#10003;</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Expertise */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">Technology Expertise</h2>
        <p className="text-[var(--muted)] mb-8">
          Core technologies and platforms I work with regularly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techGroups.map((group) => (
            <div
              key={group.category}
              className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]"
            >
              <h3 className="text-base font-semibold mb-4">{group.category}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">&#10003;</span>
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
        <h2 className="text-2xl font-semibold mb-6">Languages</h2>
        <ul className="flex flex-wrap gap-4">
          {languages.map((lang) => (
            <li
              key={lang}
              className="px-5 py-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--foreground)]"
            >
              {lang}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
