import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Musa Residency - Artist Home Exchange Platform",
  description: "Connect with artists worldwide through creative space exchanges. Find inspiring residencies and share your artistic home with fellow creators.",
  keywords: ["artist residency", "home exchange", "creative spaces", "artist community"],
  openGraph: {
    title: "Musa Residency - Artist Home Exchange Platform",
    description: "Connect with artists worldwide through creative space exchanges",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}