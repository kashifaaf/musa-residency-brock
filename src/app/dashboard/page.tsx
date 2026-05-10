import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { listings, bookings, notifications } from '@/lib/db/schema';
import { eq, and, or, gte, desc } from 'drizzle-orm';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { UpcomingBookings } from '@/components/dashboard/UpcomingBookings';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const userId = session.user.id;
  
  // Fetch user's listings
  const userListings = await db.select().from(listings).where(eq(listings.hostId, userId));
  
  // Fetch upcoming bookings (as host and guest)
  const upcomingBookings = await db.select().from(bookings)
    .where(
      and(
        or(
          eq(bookings.hostId, userId),
          eq(bookings.guestId, userId)
        ),
        gte(bookings.checkOut, new Date()),
        eq(bookings.status, 'approved')
      )
    )
    .orderBy(bookings.checkIn)
    .limit(5);
  
  // Fetch unread notifications
  const unreadNotifications = await db.select().from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name || 'Artist'}!</h1>
        <p className="text-muted-foreground">Manage your creative spaces and bookings</p>
      </div>

      <DashboardStats 
        listingsCount={userListings.length}
        upcomingBookingsCount={upcomingBookings.length}
        unreadNotificationsCount={unreadNotifications.length}
      />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingBookings bookings={upcomingBookings} userId={userId} />
          <RecentActivity notifications={unreadNotifications} />
        </div>
        
        <div>
          <QuickActions hasListings={userListings.length > 0} />
        </div>
      </div>
    </div>
  );
}