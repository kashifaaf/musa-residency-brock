import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
  stats: {
    totalHomes: number;
    activeBookings: number;
    totalEarnings: number;
    completedStays: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Homes',
      value: stats.totalHomes.toString(),
      icon: '🏠',
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings.toString(),
      icon: '📅',
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(stats.totalEarnings),
      icon: '💰',
    },
    {
      title: 'Completed Stays',
      value: stats.completedStays.toString(),
      icon: '✅',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}