import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listingPhotos } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  listingImage: f({ image: { maxFileSize: "8MB", maxFileCount: 20 } })
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session?.user?.id) throw new UploadThingError("Unauthorized");
      
      const listingId = req.headers.get("x-listing-id");
      if (!listingId) throw new UploadThingError("No listing ID provided");
      
      // Check photo count
      const db = getDb();
      const photoCount = await db
        .select({ count: count() })
        .from(listingPhotos)
        .where(eq(listingPhotos.listingId, listingId));
      
      if (photoCount[0].count >= 20) {
        throw new UploadThingError("Maximum 20 photos per listing");
      }
      
      return { userId: session.user.id, listingId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const db = getDb();
      
      // Get current max order
      const maxOrder = await db
        .select({ order: listingPhotos.order })
        .from(listingPhotos)  
        .where(eq(listingPhotos.listingId, metadata.listingId))
        .orderBy(listingPhotos.order)
        .limit(1);
      
      await db.insert(listingPhotos).values({
        listingId: metadata.listingId,
        url: file.url,
        order: maxOrder[0]?.order ? maxOrder[0].order + 1 : 0,
      });
      
      return { uploadedBy: metadata.userId };
    }),
    
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session?.user?.id) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;