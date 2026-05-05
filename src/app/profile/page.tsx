import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ProfileForm } from "@/components/profile/ProfileForm"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const db = getDb()
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your profile information and preferences</p>
          </div>
          <div className="p-6">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}