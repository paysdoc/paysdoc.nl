interface SkillCardProps {
  title: string;
  description: string;
}

export default function SkillCard({ title, description }: SkillCardProps) {
  return (
    <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors">
      <div className="w-8 h-1 rounded-full bg-[var(--accent)] mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
