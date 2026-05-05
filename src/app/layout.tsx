import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/Providers"
import { Header } from "@/components/Header"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Musa Residency - Home Exchange for Artists",
  description: "Connect with artists worldwide through specialized home exchange platform. Find inspiring creative spaces for your next residency.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}