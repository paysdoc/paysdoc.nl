import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  badge?: string;
  badgeVariant?: 'pilot' | 'available';
  ctaText?: string;
  ctaHref?: string;
}

export default function ServiceCard({
  title,
  description,
  features,
  badge,
  badgeVariant,
  ctaText,
  ctaHref,
}: ServiceCardProps) {
  const badgeStyle =
    badgeVariant === 'available'
      ? { backgroundColor: 'var(--accent)', color: '#fff' }
      : { backgroundColor: 'var(--accent-secondary)', color: '#fff' };

  return (
    <div className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] flex flex-col">
      {badge && (
        <span
          className="inline-block self-start text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={badgeStyle}
        >
          {badge}
        </span>
      )}
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-[var(--muted)] mb-6">{description}</p>
      <ul className="space-y-2 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>
      {ctaText && ctaHref && (
        <div className="mt-6">
          <Link
            href={ctaHref}
            className="inline-block px-6 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm"
          >
            {ctaText}
          </Link>
        </div>
      )}
    </div>
  );
}
