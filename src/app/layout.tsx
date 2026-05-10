import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Musa Residency - Creative Home Exchange",
  description: "Connect with artists worldwide through curated home exchanges. Find inspiring spaces and authentic cultural experiences.",
  openGraph: {
    title: "Musa Residency - Creative Home Exchange",
    description: "Connect with artists worldwide through curated home exchanges",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}