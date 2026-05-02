import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HomeForm } from '@/components/HomeForm';

export default async function NewHomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List Your Home</h1>
        <p className="mt-2 text-gray-600">
          Share your space with fellow artists and creators.
        </p>
      </div>

      <HomeForm />
    </div>
  );
}