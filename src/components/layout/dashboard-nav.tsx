'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'My Homes', href: '/dashboard/homes', icon: '🏠' },
  { name: 'Bookings', href: '/dashboard/bookings', icon: '📅' },
  { name: 'Search', href: '/search', icon: '🔍' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white shadow-sm border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h2>
        
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}