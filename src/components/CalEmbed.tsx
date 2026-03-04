'use client';

export default function CalEmbed({ calLink }: { calLink: string }) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[var(--border)]">
      <iframe
        src={`https://cal.com/${calLink}?embed=true&theme=auto`}
        className="w-full border-0"
        style={{ height: '700px' }}
        title="Book a discovery call"
      />
    </div>
  );
}
