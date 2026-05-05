import { HomeCard } from './home-card';
import type { Home } from '@/lib/types';

interface HomesListProps {
  homes: Home[];
  showEdit?: boolean;
}

export function HomesList({ homes, showEdit = false }: HomesListProps) {
  if (homes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No homes found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {homes.map((home) => (
        <div key={home.id} className="relative">
          <HomeCard home={home} />
          {showEdit && (
            <div className="absolute top-2 right-2">
              <button className="bg-white rounded-full p-2 shadow-sm border">
                ✏️
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}