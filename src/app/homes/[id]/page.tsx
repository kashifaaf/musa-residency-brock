import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getHomeDetails } from '@/lib/actions/homes';
import { BookingForm } from '@/components/booking/BookingForm';
import { formatCurrency } from '@/lib/utils';

interface HomePageProps {
  params: {
    id: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const result = await getHomeDetails(params.id);

  if (!result.success) {
    notFound();
  }

  const home = result.data;
  const amenities = home.amenities ? JSON.parse(home.amenities) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{home.title}</h1>
        <p className="text-lg text-gray-600 mt-2">{home.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photos and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {home.photos && home.photos.length > 0 ? (
              home.photos.map((photo, index) => (
                <div key={photo.id} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.caption || home.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No photos available</span>
              </div>
            )}
          </div>

          {/* Host Info */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Hosted by {home.host?.name}
            </h3>
            <div className="flex items-center space-x-4">
              {home.host?.photoUrl && (
                <Image
                  src={home.host.photoUrl}
                  alt={home.host.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{home.host?.name}</p>
                <p className="text-gray-600 text-sm">Verified Host</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About this space
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap">{home.description}</p>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {home.houseRules && (
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                House rules
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">{home.houseRules}</p>
            </div>
          )}
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="card">
              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(home.pricePerNight)} <span className="text-lg font-normal text-gray-600">/ night</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4 mt-2">
                  <span>{home.bedrooms} bedroom{home.bedrooms !== 1 ? 's' : ''}</span>
                  <span>{home.bathrooms} bathroom{home.bathrooms !== 1 ? 's' : ''}</span>
                  <span>Up to {home.maxGuests} guests</span>
                </div>
              </div>
              
              <BookingForm home={home} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}