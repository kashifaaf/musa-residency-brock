import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/signin");
  }

  const db = getDb();
  const fullUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (fullUser.length === 0) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Your Profile</h1>
        <ProfileForm user={fullUser[0]} />
      </div>
    </div>
  );
}