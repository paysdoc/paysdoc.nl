import type { Metadata } from 'next';
import InterestForm from '@/components/InterestForm';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Interested in the pilot?</h1>
      <p className="text-[var(--muted)] mb-10">
        Leave your email and we&apos;ll be in touch when the Paysdoc pilot opens up.
      </p>

      <InterestForm />

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <h2 className="text-xl font-semibold mb-4">Other ways to reach us</h2>
        <div className="space-y-3 text-[var(--muted)]">
          <p>
            Email:{' '}
            <a
              href="mailto:info@paysdoc.nl"
              className="text-[var(--accent)] hover:underline"
            >
              info@paysdoc.nl
            </a>
          </p>
          <p>
            LinkedIn:{' '}
            <a
              href="https://www.linkedin.com/in/martinkoster/"
              className="text-[var(--accent)] hover:underline"
            >
              linkedin.com/company/paysdoc
            </a>
          </p>
          <p>
            GitHub:{' '}
            <a
              href="https://github.com/paysdoc"
              className="text-[var(--accent)] hover:underline"
            >
              github.com/paysdoc
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
