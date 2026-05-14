import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { BookingDetails } from '@/components/booking/BookingDetails';
import { MessageThread } from '@/components/messaging/MessageThread';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const db = getDb();
  const booking = await db.query.bookings.findFirst({
    where: (bookings, { and, eq, or }) => 
      and(
        eq(bookings.id, id),
        or(
          eq(bookings.guestId, session.user.id),
          eq(bookings.hostId, session.user.id)
        )
      ),
    with: {
      home: true,
      guest: true,
      host: true,
      payment: true,
      messages: {
        with: {
          sender: true,
          recipient: true,
        },
        orderBy: (messages, { asc }) => asc(messages.createdAt),
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const isHost = booking.hostId === session.user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BookingDetails booking={booking} isHost={isHost} />
          </div>
          <div>
            <MessageThread 
              bookingId={booking.id}
              messages={booking.messages}
              currentUserId={session.user.id}
              otherUser={isHost ? booking.guest : booking.host}
            />
          </div>
        </div>
      </div>
    </div>
  );
}