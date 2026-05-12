import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Musa Residency - Artist Home Exchange Platform",
  description: "Connect with artists worldwide through curated home exchanges. Find inspiring creative spaces and authentic cultural experiences.",
  keywords: "artist residency, home exchange, creative spaces, cultural exchange, remote work",
  authors: [{ name: "Musa Residency" }],
  openGraph: {
    title: "Musa Residency - Artist Home Exchange",
    description: "Exchange homes with artists and creatives worldwide",
    type: "website",
    url: "https://musa-residency.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musa Residency",
    description: "Artist home exchange platform",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}