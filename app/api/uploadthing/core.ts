import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { utapi } from "@/utils/server/uploadthing"
import { z } from "zod"
import clientPromise from "@/utils/mongodb"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  projectLogo: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .input(z.string())
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      // If you throw, the user will not be able to upload
      if (!user?.id) throw new UploadThingError("Unauthorized")

      const { success, reset } = await ratelimit.limit(user.id)

      if (!success) {
        throw new UploadThingError("Rate limit exceeded")
      }

      const client = await clientPromise
      const collection = client.db("Main").collection("projects")
      const board = await collection.findOne({ urlName: input })

      if (!board) throw new UploadThingError("Board not found")
      if (board.author !== user.id) throw new UploadThingError("User not authorized to upload to this board")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, projectName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("projects")
      let project = await collection.findOne({ urlName: metadata.projectName })

      if (!project) throw new UploadThingError("Project not found after upload")

      const key = file.key

      const oldLogoKey = project.settings.logoKey // check if it exists first
      if (oldLogoKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldLogoKey, { keyType: "fileKey" })
      }

      await collection.updateOne(
        { urlName: metadata.projectName },
        {
          $set: {
            "settings.logo": file.url,
            "settings.logoKey": key,
          },
        },
      )

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { projectName: metadata.projectName, logo: file.url }
    }),
  projectFavicon: f({ image: { maxFileSize: "64KB", maxFileCount: 1 } })
    // FAVICON UPLOAD!!!!
    .input(z.string())
    .middleware(async ({ req, input }) => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user?.id) throw new UploadThingError("Unauthorized")

      const { success, reset } = await ratelimit.limit(user.id)

      if (!success) {
        throw new UploadThingError("Rate limit exceeded")
      }

      const client = await clientPromise
      const collection = client.db("Main").collection("projects")
      const project = await collection.findOne({ urlName: input })

      if (!project) throw new UploadThingError("Project not found")
      if (project.author !== user.id) throw new UploadThingError("User not authorized to upload to this project")

      return { userId: user.id, projectName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("projects")
      let project = await collection.findOne({ urlName: metadata.projectName })

      if (!project) throw new UploadThingError("Board not found after upload")

      const key = file.key

      const oldFaviconKey = project.settings.faviconKey // check if it exists first
      if (oldFaviconKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldFaviconKey, { keyType: "fileKey" })
      }

      await collection.updateOne(
        { urlName: metadata.projectName },
        {
          $set: {
            "settings.favicon": file.url,
            "settings.faviconKey": key,
          },
        },
      )

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { projectName: metadata.projectName, favicon: file.url }
    }),
  suggestionImage: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    // Public view suggestion image attachments
    .input(z.string())
    .middleware(async ({ req, input }) => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!user?.id) throw new UploadThingError("Unauthorized")

      const { success, reset } = await ratelimit.limit(user.id)

      if (!success) {
        throw new UploadThingError("Rate limit exceeded")
      }

      const client = await clientPromise
      const collection = client.db("Main").collection("boards")
      const board = await collection.findOne({ urlName: input })

      // CHECK IF THE BOARD IS PREMIUM AND ALLOWED TO UPLOAD
      if (!board) throw new UploadThingError("Board not found")
      if (!board.authorIsPremium) throw new UploadThingError("Uploads not allowed on this board")

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { favicon: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
