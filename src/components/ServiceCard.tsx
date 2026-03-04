interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
}

export default function ServiceCard({ title, description, features }: ServiceCardProps) {
  return (
    <div className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-[var(--muted)] mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
