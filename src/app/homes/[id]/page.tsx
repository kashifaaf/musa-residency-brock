import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { homes, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HomeDetails } from '@/components/HomeDetails';
import { BookingForm } from '@/components/BookingForm';
import { HomeWithHost } from '@/lib/types';

interface HomePageProps {
  params: {
    id: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const session = await getServerSession(authOptions);
  const db = getDb();

  const [result] = await db
    .select({
      home: homes,
      host: {
        id: users.id,
        name: users.name,
        email: users.email,
        bio: users.bio,
        location: users.location,
        profilePhoto: users.profilePhoto,
      },
    })
    .from(homes)
    .innerJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.id, params.id))
    .limit(1);

  if (!result) {
    notFound();
  }

  const home: HomeWithHost = {
    id: result.home.id,
    title: result.home.title,
    description: result.home.description,
    location: result.home.location,
    maxGuests: result.home.maxGuests,
    amenities: result.home.amenities ? JSON.parse(result.home.amenities) : [],
    photos: result.home.photos ? JSON.parse(result.home.photos) : [],
    host: {
      id: result.host.id,
      name: result.host.name,
      profilePhoto: result.host.profilePhoto,
    },
    availability: [], // TODO: Load actual availability
  };

  // Check if current user is the host
  const isHost = session?.user?.email === result.host.email;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HomeDetails home={home} host={result.host} />
        </div>
        
        <div className="lg:col-span-1">
          {!isHost && session ? (
            <BookingForm homeId={home.id} maxGuests={home.maxGuests} />
          ) : !session ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-center text-gray-600">
                <a href="/auth/signin" className="text-blue-600 hover:underline">
                  Sign in
                </a>{' '}
                to book this home.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-center text-gray-600">
                This is your listing. You cannot book your own home.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}