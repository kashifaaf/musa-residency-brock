'use client';

import { useState } from 'react';
import { BookingsList } from './bookings-list';
import type { BookingRequest } from '@/lib/types';

interface BookingsTabsProps {
  myTrips: Array<BookingRequest & {
    home?: { id: string; title: string; location: string; photos?: string[] };
    guest?: { id: string; name: string; email: string; profilePhoto?: string };
  }>;
  myHosting: Array<BookingRequest & {
    home?: { id: string; title: string; location: string; photos?: string[] };
    guest?: { id: string; name: string; email: string; profilePhoto?: string };
  }>;
}

export function BookingsTabs({ myTrips, myHosting }: BookingsTabsProps) {
  const [activeTab, setActiveTab] = useState<'trips' | 'hosting'>('trips');

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('trips')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trips'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Trips ({myTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('hosting')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hosting'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hosting ({myHosting.length})
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'trips' ? (
          <BookingsList bookings={myTrips} userRole="guest" />
        ) : (
          <BookingsList bookings={myHosting} userRole="host" />
        )}
      </div>
    </div>
  );
}