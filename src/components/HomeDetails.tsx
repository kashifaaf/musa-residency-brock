import { HomeWithHost } from '@/lib/types';

interface HomeDetailsProps {
  home: HomeWithHost;
  host: {
    name: string;
    bio: string | null;
    location: string | null;
    profilePhoto: string | null;
  };
}

export function HomeDetails({ home, host }: HomeDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {home.photos.length > 0 ? (
          home.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${home.title} - Photo ${index + 1}`}
              className="h-64 w-full rounded-lg object-cover"
            />
          ))
        ) : (
          <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No photos available</span>
          </div>
        )}
      </div>

      {/* Home Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{home.title}</h1>
        <p className="mt-2 text-lg text-gray-600">{home.location}</p>
        <p className="mt-1 text-gray-600">Up to {home.maxGuests} guests</p>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">About this space</h2>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">{home.description}</p>
      </div>

      {/* Amenities */}
      {home.amenities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {home.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Info */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-900">Meet your host</h2>
        <div className="mt-4 flex items-start space-x-4">
          {host.profilePhoto ? (
            <img
              src={host.profilePhoto}
              alt={host.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{host.name}</h3>
            {host.location && (
              <p className="text-sm text-gray-600">{host.location}</p>
            )}
            {host.bio && (
              <p className="mt-2 text-gray-700">{host.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}