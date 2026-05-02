import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { homes, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default async function MyHomesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user) {
    redirect('/auth/signin');
  }

  const userHomes = await db
    .select()
    .from(homes)
    .where(eq(homes.hostId, user.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Homes</h1>
          <p className="mt-2 text-gray-600">Manage your home listings and availability.</p>
        </div>
        <Link href="/host/homes/new">
          <Button>Add New Home</Button>
        </Link>
      </div>

      {userHomes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">No homes listed yet</h3>
            <p className="mt-1 text-gray-500">Get started by adding your first home listing.</p>
            <div className="mt-6">
              <Link href="/host/homes/new">
                <Button>Add Your First Home</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userHomes.map((home) => {
            const photos = home.photos ? JSON.parse(home.photos) : [];
            return (
              <Card key={home.id} className="overflow-hidden">
                {photos.length > 0 && (
                  <img
                    src={photos[0]}
                    alt={home.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{home.title}</h3>
                  <p className="text-sm text-gray-600">{home.location}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Up to {home.maxGuests} guests
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Link href={`/host/homes/${home.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/host/homes/${home.id}/availability`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Availability
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}