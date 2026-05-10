import Link from "next/link";
import { Plus, Home, Calendar, MessageSquare, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your homes and bookings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Your Homes</p>
              </div>
            </div>
            <Link
              href="/dashboard/homes/new"
              className="mt-4 flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add your first home
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Active Bookings</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Messages</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Profile</p>
                <Link
                  href="/dashboard/profile"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Booking Requests</h2>
            <div className="text-center py-8">
              <p className="text-gray-600">No booking requests yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Add a home to start receiving bookings
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Your Bookings</h2>
            <div className="text-center py-8">
              <p className="text-gray-600">No bookings yet</p>
              <Link
                href="/homes"
                className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
              >
                Browse homes to book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}