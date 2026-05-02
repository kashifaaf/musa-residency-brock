import Link from 'next/link';
import { Card } from './ui/Card';
import { HomeWithHost } from '@/lib/types';

interface HomeCardProps {
  home: HomeWithHost;
}

export function HomeCard({ home }: HomeCardProps) {
  const mainPhoto = home.photos.length > 0 ? home.photos[0] : '/placeholder-home.jpg';

  return (
    <Link href={`/homes/${home.id}`}>
      <Card className="overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer">
        <div className="aspect-square overflow-hidden">
          <img
            src={mainPhoto}
            alt={home.title}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {home.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{home.location}</p>
              <p className="text-sm text-gray-500 mt-1">
                Up to {home.maxGuests} guests
              </p>
            </div>
            
            {home.host.profilePhoto && (
              <img
                src={home.host.profilePhoto}
                alt={home.host.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {home.description}
          </p>
          
          {home.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {home.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  {amenity}
                </span>
              ))}
              {home.amenities.length > 3 && (
                <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{home.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}