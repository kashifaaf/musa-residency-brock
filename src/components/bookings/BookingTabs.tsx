'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BookingTabsProps {
  activeTab: string;
}

export function BookingTabs({ activeTab }: BookingTabsProps) {
  const searchParams = useSearchParams();

  const tabs = [
    { id: 'guest', label: 'As Guest' },
    { id: 'host', label: 'As Host' },
  ];

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/bookings?tab=${tab.id}`}
            className={cn(
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}