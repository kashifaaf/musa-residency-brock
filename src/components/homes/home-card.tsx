import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Home } from '@/lib/types';

interface HomeCardProps {
  home: Home & { host?: { id: string; name: string; profilePhoto?: string } };
}

export function HomeCard({ home }: HomeCardProps) {
  const mainPhoto = home.photos?.[0] || '/placeholder-home.jpg';

  return (
    <Link href={`/homes/${home.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-[4/3] relative">
          <Image
            src={mainPhoto}
            alt={home.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{home.title}</h3>
            <span className="text-sm text-gray-500">
              {formatCurrency(parseFloat(home.pricePerNight))}/night
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{home.location}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{home.bedrooms} bed • {home.bathrooms} bath</span>
            <span>Up to {home.maxGuests} guests</span>
          </div>
          
          {home.host && (
            <div className="mt-3 pt-3 border-t flex items-center">
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-2">
                {home.host.profilePhoto && (
                  <Image
                    src={home.host.profilePhoto}
                    alt={home.host.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
              </div>
              <span className="text-xs text-gray-600">Hosted by {home.host.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}