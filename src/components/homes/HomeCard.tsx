import Link from 'next/link';
import Image from 'next/image';
import { Home } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface HomeCardProps {
  home: Home & { photos?: { url: string }[] };
}

export function HomeCard({ home }: HomeCardProps) {
  const primaryPhoto = home.photos?.[0]?.url || '/placeholder-home.jpg';

  return (
    <Link href={`/homes/${home.id}`} className="group">
      <div className="card p-0 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={primaryPhoto}
            alt={home.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-medium">
            {formatCurrency(home.pricePerNight)}/night
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {home.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{home.location}</p>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>{home.bedrooms} bed</span>
            <span>{home.bathrooms} bath</span>
            <span>Up to {home.maxGuests} guests</span>
          </div>
          
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {home.description}
          </p>
        </div>
      </div>
    </Link>
  );
}