import type { Metadata } from 'next';
import CalEmbed from '@/components/CalEmbed';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
      <p className="text-[var(--muted)] mb-10">
        Book a free 30-minute discovery call to discuss how AI-powered
        development can accelerate your workflow.
      </p>

      <CalEmbed calLink="paysdoc/discovery-call" />

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <h2 className="text-xl font-semibold mb-4">Other ways to reach me</h2>
        <div className="space-y-3 text-[var(--muted)]">
          <p>
            GitHub:{' '}
            <a
              href="https://github.com/paysdoc"
              className="text-[var(--accent)] hover:underline"
            >
              github.com/paysdoc
            </a>
          </p>
          <p>
            Email:{' '}
            <a
              href="mailto:info@paysdoc.nl"
              className="text-[var(--accent)] hover:underline"
            >
              info@paysdoc.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
