import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { utapi } from "@/utils/server/uploadthing"
import { Suggestion } from "@/types/SuggestionBoard"
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
    const boardsCollection = db.collection("boards")
    const waitlistCollection = db.collection("waitlists")
    const projectsCollection = db.collection("projects")

    const board = await boardsCollection.findOne({ urlName })
    const project = await projectsCollection.findOne({ urlName })
    const waitlist = await waitlistCollection.findOne({ urlName })

    if (board && project && waitlist) {
      if (board.author !== user.id || project.author !== user.id || waitlist.author !== user.id)
        return NextResponse.json({ message: "User not authorized to delete" }, { status: 403 })

      // delete images from suggestions on feedback board
      board.suggestions.forEach(async (suggestion: Suggestion) => {
        if (suggestion.imageUrls[0]) {
          await utapi.deleteFiles(extractFileKey(suggestion.imageUrls[0]), { keyType: "fileKey" })
        }
      })

      // delete logo and favicon images from project
      await utapi.deleteFiles(project.settings.logoKey, { keyType: "fileKey" })
      await utapi.deleteFiles(project.settings.faviconKey, { keyType: "fileKey" })

      const boardResult = await boardsCollection.deleteOne({ urlName })
      const projectResult = await projectsCollection.deleteOne({ urlName })
      const waitlistResult = await waitlistCollection.deleteOne({ urlName })
    }

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
