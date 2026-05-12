import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const db = getDb();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (user[0]?.location && user[0]?.bio) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about yourself to get started
          </p>
        </div>
        <OnboardingForm userId={session.user.id} />
      </div>
    </div>
  );
}