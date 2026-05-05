import { requireAuth } from '@/lib/session';
import { getDb } from '@/lib/db';
import { homes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HomesList } from '@/components/homes/homes-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function MyHomesPage() {
  const session = await requireAuth();
  const db = getDb();

  const userHomes = await db.select().from(homes).where(eq(homes.hostId, session.userId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Homes</h1>
        <Button asChild>
          <Link href="/dashboard/homes/new">Add New Home</Link>
        </Button>
      </div>
      
      {userHomes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No homes listed yet</h3>
          <p className="text-gray-600 mb-6">Start earning by listing your first home</p>
          <Button asChild>
            <Link href="/dashboard/homes/new">List Your Home</Link>
          </Button>
        </div>
      ) : (
        <HomesList homes={userHomes} showEdit={true} />
      )}
    </div>
  );
}