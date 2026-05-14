import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuestBookings } from '@/components/booking/GuestBookings';
import { HostBookings } from '@/components/booking/HostBookings';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bookings</h1>
        
        <Tabs defaultValue="guest" className="space-y-4">
          <TabsList>
            <TabsTrigger value="guest">As Guest</TabsTrigger>
            <TabsTrigger value="host">As Host</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guest">
            <GuestBookings userId={session.user.id} />
          </TabsContent>
          
          <TabsContent value="host">
            <HostBookings userId={session.user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}