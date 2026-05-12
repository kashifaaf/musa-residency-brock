import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listings, listingPhotos } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { EditListingForm } from "@/components/host/EditListingForm";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const db = getDb();
  
  const listing = await db
    .select()
    .from(listings)
    .where(and(
      eq(listings.id, id),
      eq(listings.hostId, session.user.id)
    ))
    .limit(1);

  if (!listing[0]) {
    notFound();
  }

  const photos = await db
    .select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, id))
    .orderBy(listingPhotos.order);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit listing</h1>
        <EditListingForm 
          listing={listing[0]} 
          photos={photos}
        />
      </div>
    </div>
  );
}