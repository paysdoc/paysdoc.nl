import Hero from '@/components/Hero';
import SkillCard from '@/components/SkillCard';

const skills = [
  {
    icon: '\u{1F916}',
    title: 'AI Agent Orchestration',
    description:
      'Multi-agent workflows that autonomously plan, implement, test, and review code changes.',
  },
  {
    icon: '\u{1F504}',
    title: 'Full SDLC Automation',
    description:
      'From issue creation to merged pull request — planning, building, testing, reviewing, and documenting.',
  },
  {
    icon: '\u{1F6E0}',
    title: 'TypeScript & Node.js',
    description:
      'Production-grade TypeScript systems with strong typing, modular architecture, and comprehensive testing.',
  },
  {
    icon: '\u{1F310}',
    title: 'GitHub Integration',
    description:
      'Webhook-driven automation that responds to issues, comments, and PRs in real time.',
  },
  {
    icon: '\u{1F9EA}',
    title: 'Automated Testing',
    description:
      'Unit, integration, and E2E test suites with automatic failure resolution and retry logic.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Auto Documentation',
    description:
      'AI-generated technical documentation, conditional docs, and change summaries with every release.',
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <Hero />
      <section className="pb-24">
        <h2 className="text-2xl font-bold text-center mb-12">
          What I Build
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill.title} {...skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
