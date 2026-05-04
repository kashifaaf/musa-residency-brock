import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface HomeCardProps {
  home: {
    id: string;
    title: string;
    description: string;
    location: string;
    pricePerNight: string;
    maxGuests: number;
    photos: Array<{ url: string }>;
    hostName: string;
  };
}

export function HomeCard({ home }: HomeCardProps) {
  const primaryPhoto = home.photos[0]?.url || '/placeholder-home.jpg';
  
  return (
    <Link href={`/homes/${home.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={primaryPhoto}
            alt={home.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate">{home.title}</h3>
              <p className="text-sm text-muted-foreground">{home.location}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(home.pricePerNight)}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {home.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Up to {home.maxGuests} guests
            </span>
            <span className="text-muted-foreground">
              Host: {home.hostName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}