import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const actions = [
    {
      title: 'List a New Home',
      description: 'Add another property to your portfolio',
      href: '/dashboard/homes/new',
      icon: '🏠',
    },
    {
      title: 'View My Homes',
      description: 'Manage your existing listings',
      href: '/dashboard/homes',
      icon: '📋',
    },
    {
      title: 'Search Homes',
      description: 'Find your next creative getaway',
      href: '/search',
      icon: '🔍',
    },
    {
      title: 'My Bookings',
      description: 'View trips and hosting requests',
      href: '/dashboard/bookings',
      icon: '📅',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mr-3">{action.icon}</div>
              <div>
                <h3 className="font-medium text-sm">{action.title}</h3>
                <p className="text-gray-600 text-xs">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}