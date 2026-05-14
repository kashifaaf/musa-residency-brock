import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { getDb } from '@/lib/db';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user.email!),
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}