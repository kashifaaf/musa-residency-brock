import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { homes, users, availability } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { HomeDetails } from '@/components/homes/home-details';
import { BookingForm } from '@/components/bookings/booking-form';
import { getSession } from '@/lib/session';

interface HomePageProps {
  params: Promise<{ id: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { id } = await params;
  const session = await getSession();
  const db = getDb();

  const homeData = await db
    .select({
      id: homes.id,
      hostId: homes.hostId,
      title: homes.title,
      description: homes.description,
      location: homes.location,
      pricePerNight: homes.pricePerNight,
      bedrooms: homes.bedrooms,
      bathrooms: homes.bathrooms,
      maxGuests: homes.maxGuests,
      amenities: homes.amenities,
      photos: homes.photos,
      isActive: homes.isActive,
      createdAt: homes.createdAt,
      updatedAt: homes.updatedAt,
      host: {
        id: users.id,
        name: users.name,
        bio: users.bio,
        location: users.location,
        profilePhoto: users.profilePhoto,
        createdAt: users.createdAt,
      },
    })
    .from(homes)
    .innerJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.id, id))
    .limit(1);

  if (!homeData.length || !homeData[0].isActive) {
    notFound();
  }

  const home = homeData[0];

  // Get available dates
  const availableDates = await db
    .select({
      startDate: availability.startDate,
      endDate: availability.endDate,
    })
    .from(availability)
    .where(
      and(
        eq(availability.homeId, id),
        eq(availability.isBooked, false),
        gte(availability.endDate, new Date())
      )
    );

  const canBook = session && session.userId !== home.hostId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HomeDetails home={home} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {canBook ? (
                <BookingForm 
                  home={home} 
                  availableDates={availableDates}
                  currentUserId={session.userId}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-2">${home.pricePerNight}</p>
                    <p className="text-gray-600 mb-4">per night</p>
                    {!session ? (
                      <p className="text-gray-600">Please log in to book this home</p>
                    ) : (
                      <p className="text-gray-600">You cannot book your own home</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}