import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your bookings, listings, and profile
        </p>
      </div>

      <DashboardTabs />
    </div>
  );
}