import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Bed, Bath } from "lucide-react";
import { type Home, type User } from "@/types";
import { truncateText } from "@/lib/utils";

interface HomeCardProps {
  home: Home;
  host: User;
}

export function HomeCard({ home, host }: HomeCardProps) {
  const mainPhoto = home.photos[0];
  
  return (
    <Link 
      href={`/homes/${home.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3]">
        {mainPhoto ? (
          <Image
            src={mainPhoto.url}
            alt={mainPhoto.caption || home.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary-600">
          {home.title}
        </h3>
        
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{home.city}, {home.country}</span>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          {truncateText(home.description, 100)}
        </p>
        
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {home.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {home.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {home.maxGuests}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            by {host.name}
          </div>
        </div>
      </div>
    </Link>
  );
}