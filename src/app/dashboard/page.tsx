import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { BookingSummary } from '@/components/dashboard/BookingSummary';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={session.user} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BookingSummary userId={session.user.id} />
          </div>
          <div>
            <RecentActivity userId={session.user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}