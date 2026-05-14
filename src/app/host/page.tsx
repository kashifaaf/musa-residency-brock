import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { MyHomes } from '@/components/host/MyHomes';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function HostDashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const homes = await db.query.homes.findMany({
    where: (homes, { eq }) => eq(homes.hostId, session.user.id),
    orderBy: (homes, { desc }) => desc(homes.createdAt),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Homes</h1>
          <Button asChild>
            <Link href="/host/new">Add New Home</Link>
          </Button>
        </div>

        {homes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't listed any homes yet.</p>
            <Button asChild>
              <Link href="/host/new">List Your First Home</Link>
            </Button>
          </div>
        ) : (
          <MyHomes homes={homes} />
        )}
      </div>
    </div>
  );
}