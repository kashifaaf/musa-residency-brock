'use client';

import { useState } from 'react';
import { BookingsList } from '@/components/dashboard/BookingsList';
import { ListingsList } from '@/components/dashboard/ListingsList';

const tabs = [
  { id: 'bookings', label: 'My Bookings' },
  { id: 'listings', label: 'My Listings' },
];

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'bookings' && <BookingsList />}
        {activeTab === 'listings' && <ListingsList />}
      </div>
    </div>
  );
}