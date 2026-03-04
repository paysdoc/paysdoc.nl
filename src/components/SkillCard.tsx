interface SkillCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function SkillCard({ title, description, icon }: SkillCardProps) {
  return (
    <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
