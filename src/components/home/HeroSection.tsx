'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchForm } from '@/components/search/SearchForm'

export function HeroSection() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (params: {
    location: string
    checkIn: string
    checkOut: string
    guests: number
  }) => {
    setIsSearching(true)
    const searchParams = new URLSearchParams({
      location: params.location,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: params.guests.toString(),
    })
    router.push(`/homes?${searchParams.toString()}`)
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Home Exchange for Creative Minds
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 text-balance">
            Connect with artists worldwide. Exchange homes, studios, and creative spaces for authentic cultural experiences.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <SearchForm onSearch={handleSearch} isLoading={isSearching} />
          </div>
        </div>
      </div>
    </section>
  )
}