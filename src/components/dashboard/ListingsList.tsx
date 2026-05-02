import Link from 'next/link';
import { getUserListings } from '@/lib/actions/dashboard';
import { HomeCard } from '@/components/homes/HomeCard';
import { Button } from '@/components/ui/Button';

export async function ListingsList() {
  const result = await getUserListings();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading listings: {result.error}</p>
      </div>
    );
  }

  const listings = result.data;

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No listings yet</h3>
        <p className="text-gray-600 mt-2 mb-6">
          List your home to start hosting fellow creators.
        </p>
        <Link href="/host">
          <Button>List Your Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Your Listings ({listings.length})
        </h3>
        <Link href="/host">
          <Button>Add New Listing</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((home) => (
          <HomeCard key={home.id} home={home} />
        ))}
      </div>
    </div>
  );
}