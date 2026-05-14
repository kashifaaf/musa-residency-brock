import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CreateHomeForm } from '@/components/host/CreateHomeForm';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function NewHomePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">List Your Home</h1>
        <CreateHomeForm hostId={session.user.id} />
      </div>
    </div>
  );
}