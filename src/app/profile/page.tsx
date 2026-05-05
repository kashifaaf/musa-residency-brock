import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { ProfileForm } from "@/components/ProfileForm"
import { Header } from "@/components/Header"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const db = getDb()
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!user.length) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your profile information and preferences</p>
          </div>
          
          <div className="p-6">
            <ProfileForm user={user[0]} />
          </div>
        </div>
      </main>
    </div>
  )
}