import Image from 'next/image';
import InterestForm from '@/components/InterestForm';

export default function Hero() {
  return (
    <section className="py-24">
      <div className="flex flex-col-reverse gap-12 sm:flex-row sm:items-center sm:gap-16">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            AI-Powered Software Engineering
          </h1>
          <p className="text-lg text-[var(--muted)] mb-10">
            Turn your business idea into production-ready software. Expert
            engineering powered by AI, with nearly 30 years of experience
            behind every decision.
          </p>
          <InterestForm />
        </div>
        <div className="flex-shrink-0 flex justify-center sm:justify-end">
          <Image
            src="/images/headshot.jpg"
            alt="Martin Koster — Paysdoc"
            width={260}
            height={260}
            className="rounded-2xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
