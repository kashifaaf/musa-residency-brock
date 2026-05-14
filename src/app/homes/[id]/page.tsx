import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { HomeDetails } from '@/components/home/HomeDetails';
import { BookingCard } from '@/components/booking/BookingCard';
import { auth } from '@/lib/auth';

export default async function HomeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const db = getDb();

  const home = await db.query.homes.findFirst({
    where: (homes, { eq }) => eq(homes.id, id),
    with: {
      host: true,
      availability: {
        where: (availability, { gte }) => gte(availability.endDate, new Date()),
        orderBy: (availability, { asc }) => asc(availability.startDate),
      },
    },
  });

  if (!home || !home.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HomeDetails home={home} />
          </div>
          <div>
            <BookingCard 
              home={home} 
              availability={home.availability}
              isAuthenticated={!!session}
            />
          </div>
        </div>
      </div>
    </div>
  );
}