import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Musa Residency - Creative Home Exchange Platform',
  description: 'Exchange homes with artists and creatives worldwide. Find inspiring spaces for your next creative residency.',
  openGraph: {
    title: 'Musa Residency',
    description: 'Creative home exchange platform for artists',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Musa Residency',
    description: 'Creative home exchange platform for artists',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}