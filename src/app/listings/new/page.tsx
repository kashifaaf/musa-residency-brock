import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CreateListingForm } from '@/components/listings/CreateListingForm';

export default async function NewListingPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">List Your Creative Space</h1>
      <div className="bg-card rounded-lg shadow-sm p-6">
        <CreateListingForm />
      </div>
    </div>
  );
}