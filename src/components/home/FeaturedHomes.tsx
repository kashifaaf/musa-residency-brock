import { getDb } from '@/lib/db'
import { homes, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { HomeCard } from '@/components/homes/HomeCard'

export async function FeaturedHomes() {
  let featuredHomes: { home: typeof homes.$inferSelect; host: typeof users.$inferSelect | null }[] = []

  try {
    const db = getDb()
    featuredHomes = await db
      .select({
        home: homes,
        host: users,
      })
      .from(homes)
      .leftJoin(users, eq(homes.hostId, users.id))
      .where(and(eq(homes.isActive, true)))
      .limit(6)
  } catch (error) {
    // Database table may not exist yet (e.g., during build)
    console.warn('Failed to fetch featured homes:', error instanceof Error ? error.message : error)
    return null
  }

  if (featuredHomes.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Creative Spaces</h2>
          <p className="text-xl text-gray-600">
            Discover inspiring homes and studios from our artist community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHomes.map(({ home, host }) => (
            <HomeCard key={home.id} home={home} host={host!} />
          ))}
        </div>
      </div>
    </section>
  )
}