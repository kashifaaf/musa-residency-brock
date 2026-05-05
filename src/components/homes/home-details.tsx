import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Home } from '@/lib/types';

interface HomeDetailsProps {
  home: Home & {
    host: {
      id: string;
      name: string;
      bio?: string;
      location?: string;
      profilePhoto?: string;
      createdAt: Date;
    };
  };
}

export function HomeDetails({ home }: HomeDetailsProps) {
  const mainPhoto = home.photos?.[0] || '/placeholder-home.jpg';
  const additionalPhotos = home.photos?.slice(1) || [];

  return (
    <div className="space-y-6">
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
          <Image
            src={mainPhoto}
            alt={home.title}
            fill
            className="object-cover"
          />
        </div>
        {additionalPhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {additionalPhotos.slice(0, 4).map((photo, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={photo}
                  alt={`${home.title} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Home Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{home.title}</h1>
        <p className="text-gray-600 mb-4">{home.location}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <span>{home.bedrooms} bedrooms</span>
          <span>•</span>
          <span>{home.bathrooms} bathrooms</span>
          <span>•</span>
          <span>Up to {home.maxGuests} guests</span>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700">{home.description}</p>
        </div>
      </div>

      {/* Amenities */}
      {home.amenities && home.amenities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {home.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <span className="mr-2">•</span>
                {amenity}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Info */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">About your host</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0">
            {home.host.profilePhoto && (
              <Image
                src={home.host.profilePhoto}
                alt={home.host.name}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{home.host.name}</h4>
            {home.host.location && (
              <p className="text-gray-600 text-sm">{home.host.location}</p>
            )}
            <p className="text-gray-600 text-sm">
              Hosting since {new Date(home.host.createdAt).getFullYear()}
            </p>
            {home.host.bio && (
              <p className="text-gray-700 mt-2">{home.host.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}