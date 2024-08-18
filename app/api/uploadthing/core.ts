import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { utapi } from "@/utils/server/uploadthing"
import { z } from "zod"
import clientPromise from "@/utils/mongodb"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"
import { WaitlistPage } from "@/types/WaitlistPage"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  waitlistLogo: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
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
      const collection = client.db("Main").collection("waitlists")
      const waitlist = await collection.findOne({ urlName: input })

      if (!waitlist) throw new UploadThingError("Waitlist not found")
      if (waitlist.author !== user.id) throw new UploadThingError("User not authorized to upload to this waitlist")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, waitlistName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("waitlists")
      let waitlist = (await collection.findOne({ urlName: metadata.waitlistName })) as WaitlistPage

      if (!waitlist) throw new UploadThingError("Waitlist not found after upload")

      const key = file.key

      const oldKey = waitlist.images.logoKey // check if it exists first
      if (oldKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldKey, { keyType: "fileKey" })
      }

      await collection.updateOne({ urlName: metadata.waitlistName }, { $set: { "images.logo": file.url, "images.logoKey": key } })

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { waitlistName: metadata.waitlistName, logo: file.url }
    }),
  waitlistFavicon: f({ image: { maxFileSize: "64KB", maxFileCount: 1 } })
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
      const collection = client.db("Main").collection("waitlists")
      const waitlist = await collection.findOne({ urlName: input })

      if (!waitlist) throw new UploadThingError("Waitlist not found")
      if (waitlist.author !== user.id) throw new UploadThingError("User not authorized to upload to this waitlist")

      return { userId: user.id, waitlistName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("waitlists")
      let waitlist = await collection.findOne({ urlName: metadata.waitlistName })

      if (!waitlist) throw new UploadThingError("Waitlist not found after upload")

      const key = file.key

      const oldKey = waitlist.images.faviconKey // check if it exists first
      if (oldKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldKey, { keyType: "fileKey" })
      }

      await collection.updateOne(
        { urlName: metadata.waitlistName },
        { $set: { "images.favicon": file.url, "images.faviconKey": key } },
      )

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { waitlistName: metadata.waitlistName, favicon: file.url }
    }),
  waitlistPreview: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
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
      const collection = client.db("Main").collection("waitlists")
      const waitlist = await collection.findOne({ urlName: input })

      if (!waitlist) throw new UploadThingError("Board not found")
      if (waitlist.author !== user.id) throw new UploadThingError("User not authorized to upload to this waitlist")

      return { userId: user.id, waitlistName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("waitlists")
      let waitlist = (await collection.findOne({ urlName: metadata.waitlistName })) as WaitlistPage

      if (!waitlist) throw new UploadThingError("Waitlist not found after upload")

      const key = file.key

      const oldKey = waitlist.images.previewKey // check if it exists first
      if (oldKey) {
        // delete old logo from UploadThing
        await utapi.deleteFiles(oldKey, { keyType: "fileKey" })
      }

      await collection.updateOne(
        { urlName: metadata.waitlistName },
        { $set: { "images.preview": file.url, "images.previewKey": key } },
      )

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { waitlistName: metadata.waitlistName, logo: file.url }
    }),
  waitlistEmailContent: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
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
      const collection = client.db("Main").collection("waitlists")
      const waitlist = await collection.findOne({ urlName: input })

      if (!waitlist) throw new UploadThingError("Board not found")
      if (waitlist.author !== user.id) throw new UploadThingError("User not authorized to upload to this waitlist")
      if (waitlist.uploadedContent.length >= 300) throw new UploadThingError("Max 300 images allowed")

      return { userId: user.id, waitlistName: input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      const client = await clientPromise
      const collection = client.db("Main").collection("waitlists")
      let waitlist = (await collection.findOne({ urlName: metadata.waitlistName })) as WaitlistPage

      if (!waitlist) throw new UploadThingError("Waitlist not found after upload")

      const updatedContent = [...(waitlist.uploadedContent || []), file.url]

      await collection.updateOne({ urlName: metadata.waitlistName }, { $set: { uploadedContent: updatedContent } })

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { waitlistName: metadata.waitlistName, logo: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
