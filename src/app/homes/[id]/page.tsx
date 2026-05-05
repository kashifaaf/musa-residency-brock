import { auth } from "@/lib/auth"
import { getDb } from "@/db"
import { homes, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { HomeDetails } from "@/components/homes/HomeDetails"
import { BookingForm } from "@/components/bookings/BookingForm"

export default async function HomeDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const db = getDb()

  const [homeData] = await db
    .select({
      home: homes,
      host: users,
    })
    .from(homes)
    .leftJoin(users, eq(homes.userId, users.id))
    .where(eq(homes.id, params.id))
    .limit(1)

  if (!homeData) {
    notFound()
  }

  const { home, host } = homeData
  const isOwner = session?.user?.id === home.userId

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HomeDetails home={home} host={host} />
          </div>
          <div className="lg:col-span-1">
            {!isOwner && session && (
              <BookingForm home={home} />
            )}
            {!session && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ready to book?</h3>
                <p className="text-gray-600 mb-4">
                  Sign in to request a booking and connect with the host.
                </p>
                <a
                  href="/auth/signin"
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors inline-block text-center"
                >
                  Sign In to Book
                </a>
              </div>
            )}
            {isOwner && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">This is your listing</h3>
                <p className="text-gray-600 mb-4">
                  You can edit your listing details or view booking requests.
                </p>
                <a
                  href={`/homes/${home.id}/edit`}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors inline-block text-center"
                >
                  Edit Listing
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}