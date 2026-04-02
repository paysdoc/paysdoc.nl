import Hero from '@/components/Hero';
import SkillCard from '@/components/SkillCard';

const capabilities = [
  {
    title: 'Faster Time to Market',
    description:
      'Go from idea to working software in weeks, not months. AI accelerates development while experienced engineers ensure quality.',
  },
  {
    title: 'Built-In Quality Assurance',
    description:
      'Every feature is automatically tested and reviewed before delivery. No shortcuts, no technical debt surprises.',
  },
  {
    title: 'Transparent Progress',
    description:
      'See exactly what\'s being built and why. Clear updates in plain language, not engineering reports.',
  },
  {
    title: 'Scalable from Day One',
    description:
      'Architecture designed to grow with your business. Start small, scale confidently as your user base grows.',
  },
  {
    title: 'Full-Stack Capability',
    description:
      'From database to user interface, one team handles everything. No coordination headaches between multiple vendors.',
  },
  {
    title: 'Nearly 30 Years of Experience',
    description:
      'Proven track record across banking, retail, energy, and government. Enterprise-grade expertise applied to your startup.',
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <Hero />
      <section className="pb-24">
        <h2 className="text-2xl font-bold text-center mb-12">
          Why Paysdoc
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability) => (
            <SkillCard key={capability.title} {...capability} />
          ))}
        </div>
      </section>
    </div>
  );
}
