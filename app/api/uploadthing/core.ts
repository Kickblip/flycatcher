import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { utapi } from "@/utils/server/uploadthing"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import clientPromise from "@/utils/mongodb"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  boardLogo: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .input(z.string())
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const { userId } = auth()

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized")

      const { success, reset } = await ratelimit.limit(userId)

      if (!success) {
        throw new UploadThingError("Rate limit exceeded")
      }

      const client = await clientPromise
      const collection = client.db("Main").collection("boards")
      const board = await collection.findOne({ urlName: input })

      if (!board) throw new UploadThingError("Board not found")
      if (board.author !== userId) throw new UploadThingError("User not authorized to upload to this board")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, boardName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("boards")
      let board = await collection.findOne({ urlName: metadata.boardName })

      if (!board) throw new UploadThingError("Board not found after upload")

      const key = file.key

      const oldLogoKey = board.logoKey // check if it exists first
      if (oldLogoKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldLogoKey, { keyType: "fileKey" })
      }

      await collection.updateOne({ urlName: metadata.boardName }, { $set: { logo: file.url, logoKey: key } })

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { boardName: metadata.boardName, logo: file.url }
    }),
  boardFavicon: f({ image: { maxFileSize: "64KB", maxFileCount: 1 } })
    // FAVICON UPLOAD!!!!
    .input(z.string())
    .middleware(async ({ req, input }) => {
      const { userId } = auth()

      if (!userId) throw new UploadThingError("Unauthorized")

      const { success, reset } = await ratelimit.limit(userId)

      if (!success) {
        throw new UploadThingError("Rate limit exceeded")
      }

      const client = await clientPromise
      const collection = client.db("Main").collection("boards")
      const board = await collection.findOne({ urlName: input })

      if (!board) throw new UploadThingError("Board not found")
      if (board.author !== userId) throw new UploadThingError("User not authorized to upload to this board")

      return { userId, boardName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("boards")
      let board = await collection.findOne({ urlName: metadata.boardName })

      if (!board) throw new UploadThingError("Board not found after upload")

      const key = file.key

      const oldFaviconKey = board.faviconKey // check if it exists first
      if (oldFaviconKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldFaviconKey, { keyType: "fileKey" })
      }

      await collection.updateOne({ urlName: metadata.boardName }, { $set: { favicon: file.url, faviconKey: key } })

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { boardName: metadata.boardName, favicon: file.url }
    }),
  suggestionImage: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    // Public view suggestion image attachments
    .middleware(async ({ req }) => {
      const { userId } = auth()

      if (!userId) throw new UploadThingError("Unauthorized")

      const { success, reset } = await ratelimit.limit(userId)

      if (!success) {
        throw new UploadThingError("Rate limit exceeded")
      }

      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { favicon: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
