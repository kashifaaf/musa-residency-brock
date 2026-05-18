import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ListingForm } from "@/components/ListingForm"
import { ListingEditSidebar } from "@/components/ListingEditSidebar"

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const { id } = await params

  const listing = await db.query.listings.findFirst({
    where: and(eq(listings.id, id), eq(listings.hostId, session.user.id)),
    with: { photos: true, availability: true },
  })

  if (!listing) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Edit Listing</h1>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ListingForm existing={listing} />
            </div>
            <div className="lg:col-span-1">
              <ListingEditSidebar listing={listing} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}