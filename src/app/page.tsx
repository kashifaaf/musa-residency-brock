import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedHomes } from '@/components/home/FeaturedHomes'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Footer } from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <FeaturedHomes />
      </Suspense>
      <HowItWorks />
      <Footer />
    </>
  )
}