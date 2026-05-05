import { requireAuth } from '@/lib/session';
import { getDb } from '@/lib/db';
import { homes, bookingRequests } from '@/lib/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentBookings } from '@/components/dashboard/recent-bookings';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage() {
  const session = await requireAuth();
  const db = getDb();

  const [userHomes, userBookings] = await Promise.all([
    db.select().from(homes).where(eq(homes.hostId, session.userId)),
    db.select({
      id: bookingRequests.id,
      status: bookingRequests.status,
      startDate: bookingRequests.startDate,
      endDate: bookingRequests.endDate,
      totalPrice: bookingRequests.totalPrice,
      createdAt: bookingRequests.createdAt,
      home: {
        title: homes.title,
        location: homes.location,
      },
    })
    .from(bookingRequests)
    .innerJoin(homes, eq(bookingRequests.homeId, homes.id))
    .where(
      or(
        eq(bookingRequests.guestId, session.userId),
        eq(bookingRequests.hostId, session.userId)
      )
    )
    .orderBy(desc(bookingRequests.createdAt))
    .limit(10),
  ]);

  const stats = {
    totalHomes: userHomes.length,
    activeBookings: userBookings.filter(b => ['pending', 'approved', 'paid'].includes(b.status)).length,
    totalEarnings: userBookings
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + parseFloat(b.totalPrice), 0),
    completedStays: userBookings.filter(b => b.status === 'paid').length,
  };

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentBookings bookings={userBookings} />
        <QuickActions />
      </div>
    </div>
  );
}