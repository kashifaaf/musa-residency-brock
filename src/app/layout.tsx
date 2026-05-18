import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Musa Residency — Creative Home Exchange for Artists",
  description:
    "Connect with fellow artists worldwide through curated home exchanges. Find inspiring spaces, build creative community, and travel affordably.",
  keywords: [
    "artist residency",
    "home exchange",
    "creative spaces",
    "artist travel",
    "cultural exchange",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}