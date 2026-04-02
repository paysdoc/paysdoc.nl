import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'paysdoc.nl — AI-Powered Software Development',
    template: '%s | paysdoc.nl',
  },
  description:
    'AI-powered software engineering with nearly 30 years of full-stack expertise. From idea to production-ready software for non-technical founders.',
  metadataBase: new URL('https://paysdoc.nl'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
