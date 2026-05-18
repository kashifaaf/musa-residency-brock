import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ListingForm } from "@/components/ListingForm"

export default async function CreateListingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">List Your Home</h1>
          <p className="mt-2 text-muted-foreground">
            Share your space with culturally-minded travelers.
          </p>
          <div className="mt-8">
            <ListingForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}