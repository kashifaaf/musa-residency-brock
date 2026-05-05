import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { homes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { HomeCard } from "@/components/HomeCard"
import { Plus } from "lucide-react"

export default async function HostPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  const db = getDb()
  const userHomes = await db.select().from(homes).where(eq(homes.hostId, session.user?.id!))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Listings</h1>
        <Link href="/host/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {userHomes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h2>
          <p className="text-gray-600 mb-6">
            Start earning by sharing your creative space with fellow artists.
          </p>
          <Link href="/host/new">
            <Button size="lg">Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userHomes.map((home) => {
            const homeWithHost = {
              ...home,
              host: {
                id: session.user?.id!,
                name: session.user?.name!,
                image: session.user?.image,
                location: null,
              }
            }
            return <HomeCard key={home.id} home={homeWithHost} />
          })}
        </div>
      )}
    </div>
  )
}