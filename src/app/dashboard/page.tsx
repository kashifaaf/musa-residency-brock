import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { homes, bookingRequests } from "@/lib/db/schema";
import { eq, and, or, gte, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default async function DashboardPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/signin");
  }

  const db = getDb();

  // Get user's homes
  const userHomes = await db
    .select()
    .from(homes)
    .where(eq(homes.userId, user.id))
    .orderBy(desc(homes.createdAt))
    .limit(5);

  // Get recent booking requests (both as host and guest)
  const recentBookings = await db
    .select()
    .from(bookingRequests)
    .where(
      and(
        or(
          eq(bookingRequests.hostId, user.id),
          eq(bookingRequests.guestId, user.id)
        ),
        gte(bookingRequests.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      )
    )
    .orderBy(desc(bookingRequests.createdAt))
    .limit(10);

  // Count pending requests as host
  const pendingHostRequests = recentBookings.filter(
    (booking) =>
      booking.hostId === user.id &&
      booking.status === BookingStatus.PENDING &&
      new Date(booking.requestExpiresAt) > new Date()
  ).length;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name || user.email}!</h1>
          {pendingHostRequests > 0 && (
            <p className="mt-2 text-destructive">
              You have {pendingHostRequests} pending booking request{pendingHostRequests > 1 ? "s" : ""} requiring response
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/homes/new">
            <Card className="h-full p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">List Your Home</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your creative space with artists worldwide
              </p>
            </Card>
          </Link>
          <Link href="/search">
            <Card className="h-full p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Find a Home</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover inspiring spaces for your next adventure
              </p>
            </Card>
          </Link>
          <Link href="/bookings">
            <Card className="h-full p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Your Bookings</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your upcoming and past stays
              </p>
            </Card>
          </Link>
          <Link href="/profile">
            <Card className="h-full p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Your Profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your information and preferences
              </p>
            </Card>
          </Link>
        </div>

        {/* Your Homes */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Homes</h2>
            <Link href="/homes">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {userHomes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userHomes.map((home) => (
                <Card key={home.id} className="p-6">
                  <h3 className="font-semibold">{home.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {home.city}, {home.country}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/homes/${home.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Link href={`/homes/${home.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                You haven't listed any homes yet.
              </p>
              <Link href="/homes/new">
                <Button className="mt-4">List Your First Home</Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Recent Bookings */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Link href="/bookings">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <Card key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {booking.hostId === user.id ? "Guest booking" : "Your booking"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </p>
                      <p className="mt-1 text-sm">
                        {formatCurrency(Number(booking.totalPrice))}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === BookingStatus.APPROVED
                          ? "bg-success/10 text-success"
                          : booking.status === BookingStatus.PENDING
                          ? "bg-primary/10 text-primary"
                          : booking.status === BookingStatus.DECLINED
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <Link href={`/bookings/${booking.id}`}>
                    <Button size="sm" variant="outline" className="mt-4">
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No recent bookings to show.</p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}