import { HomeCard } from './HomeCard';

// Static placeholder data for build time
const placeholderHomes = [
  {
    id: '1',
    hostId: '1',
    title: 'Cozy Artist Loft in Brooklyn',
    description: 'Beautiful space perfect for creative minds',
    address: '123 Art Street',
    city: 'Brooklyn',
    state: 'NY',
    country: 'USA',
    latitude: null,
    longitude: null,
    amenities: {
      bedrooms: 2,
      bathrooms: 1,
      workspace: true,
      wifi: true,
      kitchen: true,
      parking: false,
      artStudio: true,
      instruments: false,
      other: []
    },
    houseRules: null,
    images: ['/placeholder-home.jpg'],
    isActive: true,
    visibilityScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    host: {
      id: '1',
      name: 'Artist Host',
      email: 'host@example.com',
      emailVerified: null,
      image: null,
      bio: 'Professional artist',
      location: 'Brooklyn, NY',
      workInfo: null,
      profileImage: null,
      socialLinks: null,
      role: 'user' as const,
      isHost: true,
      responseRate: null,
      averageResponseTime: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: '2',
    hostId: '2',
    title: 'Modern Studio in Berlin',
    description: 'Minimalist space with great natural light',
    address: '456 Creative Ave',
    city: 'Berlin',
    state: null,
    country: 'Germany',
    latitude: null,
    longitude: null,
    amenities: {
      bedrooms: 1,
      bathrooms: 1,
      workspace: true,
      wifi: true,
      kitchen: true,
      parking: true,
      artStudio: false,
      instruments: true,
      other: []
    },
    houseRules: null,
    images: ['/placeholder-home.jpg'],
    isActive: true,
    visibilityScore: 95,
    createdAt: new Date(),
    updatedAt: new Date(),
    host: {
      id: '2',
      name: 'Creative Host',
      email: 'host2@example.com',
      emailVerified: null,
      image: null,
      bio: 'Musician and designer',
      location: 'Berlin, Germany',
      workInfo: null,
      profileImage: null,
      socialLinks: null,
      role: 'user' as const,
      isHost: true,
      responseRate: null,
      averageResponseTime: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: '3',
    hostId: '3',
    title: 'Charming Cottage in Provence',
    description: 'Peaceful retreat surrounded by lavender fields',
    address: '789 Lavender Lane',
    city: 'Provence',
    state: null,
    country: 'France',
    latitude: null,
    longitude: null,
    amenities: {
      bedrooms: 3,
      bathrooms: 2,
      workspace: true,
      wifi: true,
      kitchen: true,
      parking: true,
      artStudio: true,
      instruments: false,
      other: ['Garden', 'Fireplace']
    },
    houseRules: null,
    images: ['/placeholder-home.jpg'],
    isActive: true,
    visibilityScore: 98,
    createdAt: new Date(),
    updatedAt: new Date(),
    host: {
      id: '3',
      name: 'Rural Host',
      email: 'host3@example.com',
      emailVerified: null,
      image: null,
      bio: 'Writer and painter',
      location: 'Provence, France',
      workInfo: null,
      profileImage: null,
      socialLinks: null,
      role: 'user' as const,
      isHost: true,
      responseRate: null,
      averageResponseTime: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

export async function FeaturedHomes() {
  // Use static data during build time to avoid database dependency
  const featuredHomes = placeholderHomes;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredHomes.map((home) => (
        <HomeCard key={home.id} home={home} />
      ))}
    </div>
  );
}