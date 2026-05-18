import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Musa Residency — Creative Home Exchange for Artists",
  description:
    "A curated home exchange platform connecting culturally-minded remote workers with unique homes for long-term stays.",
  keywords: [
    "home exchange",
    "artist residency",
    "remote work",
    "long-term stay",
    "creative spaces",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}