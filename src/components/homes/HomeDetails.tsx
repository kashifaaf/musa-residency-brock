import { MapPin, Home as HomeIcon, Users, Bed, Bath, Wifi, Car, Wind } from "lucide-react";
import { type Home } from "@/types";
import { PROPERTY_TYPES } from "@/lib/constants";

interface HomeDetailsProps {
  home: Home;
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "WiFi": Wifi,
  "Parking": Car,
  "Air conditioning": Wind,
};

export function HomeDetails({ home }: HomeDetailsProps) {
  const propertyType = PROPERTY_TYPES.find(t => t.value === home.propertyType)?.label || home.propertyType;
  
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">{home.title}</h1>
      
      <div className="mb-6 flex items-center gap-2 text-gray-600">
        <MapPin className="h-5 w-5" />
        <span className="text-lg">{home.city}, {home.country}</span>
      </div>
      
      <div className="mb-8 flex flex-wrap gap-6 text-gray-700">
        <div className="flex items-center gap-2">
          <HomeIcon className="h-5 w-5" />
          <span>{propertyType}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>{home.maxGuests} guests</span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5" />
          <span>{home.bedrooms} {home.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5" />
          <span>{home.bathrooms} {home.bathrooms === 1 ? "bathroom" : "bathrooms"}</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">About this place</h2>
        <p className="whitespace-pre-wrap text-gray-700">{home.description}</p>
      </div>
      
      {home.amenities && home.amenities.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {home.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity];
              return (
                <div key={amenity} className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-gray-600" />}
                  <span className="text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {home.houseRules && home.houseRules.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">House Rules</h2>
          <ul className="space-y-2 text-gray-700">
            {home.houseRules.map((rule, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}