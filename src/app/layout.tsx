"use client"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

interface ClientLayoutProps {
  children: React.ReactNode
  session?: any
}

function ClientLayout({ children, session }: ClientLayoutProps) {
  return (
    <SessionProvider session={session}>
      <Navigation />
      <main>{children}</main>
    </SessionProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout session={undefined}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}