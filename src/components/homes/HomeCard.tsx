'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Home, User } from '@/lib/db/schema'
import { MapPin, Users } from 'lucide-react'

interface HomeCardProps {
  home: Home
  host: User
}

export function HomeCard({ home, host }: HomeCardProps) {
  return (
    <Link 
      href={`/homes/${home.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={home.images[0] || '/placeholder.jpg'}
          alt={home.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{home.title}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{home.city}, {home.country}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Up to {home.maxGuests} guests</span>
          </div>
          
          <div className="text-right">
            <div className="font-semibold">{formatPrice(parseFloat(home.pricePerNight))}</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            {host.image && (
              <Image
                src={host.image}
                alt={host.name || 'Host'}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div>
              <div className="text-sm font-medium">{host.name || 'Anonymous Host'}</div>
              {host.location && (
                <div className="text-xs text-gray-500">{host.location}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}