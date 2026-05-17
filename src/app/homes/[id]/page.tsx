import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { homes, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomeDetails } from '@/components/homes/HomeDetails'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  params: Promise<{ id: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { id } = await params
  const db = getDb()

  const result = await db
    .select({
      home: homes,
      host: users,
    })
    .from(homes)
    .leftJoin(users, eq(homes.hostId, users.id))
    .where(eq(homes.id, id))
    .limit(1)

  if (!result[0]) {
    notFound()
  }

  const { home, host } = result[0]

  return (
    <>
      <Header />
      <main>
        <HomeDetails home={home} host={host!} />
      </main>
      <Footer />
    </>
  )
}