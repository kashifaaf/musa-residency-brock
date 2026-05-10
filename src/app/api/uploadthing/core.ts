import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  homePhotos: f({ image: { maxFileSize: "16MB", maxFileCount: 20 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // Check if user is authenticated
      // For MVP, we'll allow uploads without auth
      return { userId: "temp-user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Return data that will be available in onClientUploadComplete
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Check auth
      return { userId: "temp-user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image uploaded for userId:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;