import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomesSearchResults } from '@/components/homes/HomesSearchResults'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  searchParams: Promise<{
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    page?: string
  }>
}

export default async function HomesPage({ searchParams }: HomePageProps) {
  const params = await searchParams

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <HomesSearchResults searchParams={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}