import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HomeForm } from "@/components/homes/HomeForm"

export default async function NewHomePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">List Your Home</h1>
            <p className="text-gray-600">Share your creative space with fellow artists</p>
          </div>
          <div className="p-6">
            <HomeForm />
          </div>
        </div>
      </div>
    </div>
  )
}