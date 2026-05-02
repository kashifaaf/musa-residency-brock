import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { CreateListingForm } from '@/components/host/CreateListingForm';

export default async function HostPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          List Your Creative Space
        </h1>
        <p className="text-gray-600 mt-2">
          Share your home with fellow artists and creators from around the world
        </p>
      </div>

      <CreateListingForm />
    </div>
  );
}