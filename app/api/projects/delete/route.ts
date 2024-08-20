import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { utapi } from "@/utils/server/uploadthing"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
})

const extractFileKey = (url: string) => {
  const parts = url.split("/")
  const filename = parts[parts.length - 1]
  return filename
}

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json(
      {
        message: "User not authenticated",
      },
      { status: 401 },
    )
  }
  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { urlName } = body

  if (!urlName) {
    return NextResponse.json(
      {
        message: "Project name is required",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const db = client.db("Main")
    const projectCollection = db.collection("projects")
    const waitlistCollection = db.collection("waitlists")
    const waitlist = await waitlistCollection.findOne({ urlName })

    if (!waitlist) return NextResponse.json({ message: "Waitlist does not exist" }, { status: 404 })

    if (waitlist.author !== user.id)
      return NextResponse.json({ message: "User not authorized to delete this board" }, { status: 403 })

    if (waitlist.images.logoKey) {
      await utapi.deleteFiles(waitlist.images.logoKey, { keyType: "fileKey" })
    }

    if (waitlist.images.faviconKey) {
      await utapi.deleteFiles(waitlist.images.faviconKey, { keyType: "fileKey" })
    }

    if (waitlist.images.previewKey) {
      await utapi.deleteFiles(waitlist.images.previewKey, { keyType: "fileKey" })
    }

    waitlist.uploadedContent.forEach(async (url: string) => {
      await utapi.deleteFiles(extractFileKey(url), { keyType: "fileKey" })
    })

    await waitlistCollection.deleteOne({ urlName })
    await projectCollection.deleteOne({ urlName })

    return NextResponse.json(
      {
        message: "Project deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error deleting project:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
