import Link from "next/link";
import { Plus, Home, Calendar, MessageSquare, User } from "lucide-react";

export default function DashboardPage() {
  // In production, get user data from session
  const user = {
    name: "John Doe",
    email: "john@example.com",
    isHost: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="mt-2 text-gray-600">Manage your bookings and listings from here.</p>
        </div>

        {!user.isHost && (
          <div className="mb-8 rounded-lg bg-primary-50 p-6">
            <h2 className="mb-2 text-xl font-semibold">Become a Host</h2>
            <p className="mb-4 text-gray-700">
              List your home and start earning from fellow remote workers.
            </p>
            <Link
              href="/host/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              List your home
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md"
          >
            <Calendar className="h-10 w-10 text-primary-600" />
            <div>
              <h3 className="font-semibold">My Bookings</h3>
              <p className="text-sm text-gray-600">View upcoming trips</p>
            </div>
          </Link>

          <Link
            href="/dashboard/listings"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md"
          >
            <Home className="h-10 w-10 text-primary-600" />
            <div>
              <h3 className="font-semibold">My Listings</h3>
              <p className="text-sm text-gray-600">Manage your homes</p>
            </div>
          </Link>

          <Link
            href="/dashboard/messages"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md"
          >
            <MessageSquare className="h-10 w-10 text-primary-600" />
            <div>
              <h3 className="font-semibold">Messages</h3>
              <p className="text-sm text-gray-600">Chat with guests</p>
            </div>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md"
          >
            <User className="h-10 w-10 text-primary-600" />
            <div>
              <h3 className="font-semibold">Profile</h3>
              <p className="text-sm text-gray-600">Edit your info</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}