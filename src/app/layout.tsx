import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Musa Residency - Artist Home Exchange Platform',
  description: 'Connect with artists worldwide through a specialized home exchange platform. Swap creative spaces, studios, and homes with fellow artists for authentic cultural immersion.',
  keywords: 'artist residency, home exchange, creative spaces, artist community, cultural exchange',
  authors: [{ name: 'Musa Residency' }],
  openGraph: {
    title: 'Musa Residency - Artist Home Exchange Platform',
    description: 'Connect with artists worldwide through a specialized home exchange platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Musa Residency',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Musa Residency - Artist Home Exchange Platform',
    description: 'Connect with artists worldwide through a specialized home exchange platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}