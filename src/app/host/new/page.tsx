import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CreateListingForm } from "@/components/CreateListingForm"

export default async function NewListingPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Listing</h1>
      <CreateListingForm />
    </div>
  )
}