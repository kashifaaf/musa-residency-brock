import { createUploadthing, type FileRouter } from "uploadthing/server"
import { getServerSession } from "next-auth"
import { getAuthOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  listingPhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 20 } })
    .middleware(async () => {
      const session = await getServerSession(getAuthOptions())
      if (!session?.user?.id) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
  profilePhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(getAuthOptions())
      if (!session?.user?.id) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter