import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { AvailabilityManager } from '@/components/host/AvailabilityManager';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function AvailabilityPage({
  params,
}: {
  params: Promise<{ homeId: string }>;
}) {
  const { homeId } = await params;
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const home = await db.query.homes.findFirst({
    where: (homes, { and, eq }) => 
      and(eq(homes.id, homeId), eq(homes.hostId, session.user.id)),
    with: {
      availability: {
        orderBy: (availability, { asc }) => asc(availability.startDate),
      },
    },
  });

  if (!home) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{home.title}</h1>
        <p className="text-gray-600 mb-8">Manage availability</p>
        <AvailabilityManager homeId={home.id} availability={home.availability} />
      </div>
    </div>
  );
}