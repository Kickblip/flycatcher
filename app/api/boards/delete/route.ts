import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { auth } from "@clerk/nextjs/server"
import { utapi } from "@/utils/server/uploadthing"
import { Suggestion } from "@/types/SuggestionBoard"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
})

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json(
      {
        message: "User not authenticated",
      },
      { status: 401 },
    )
  }
  const { success, reset } = await ratelimit.limit(userId)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { urlName } = body

  if (!urlName) {
    return NextResponse.json(
      {
        message: "Board name is required",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    const board = await collection.findOne({ urlName })

    if (board) {
      if (board.author !== userId)
        return NextResponse.json({ message: "User not authorized to delete this board" }, { status: 403 })

      const extractFileKey = (url: string) => {
        const parts = url.split("/")
        const filename = parts[parts.length - 1]
        return filename
      }

      board.suggestions.forEach(async (suggestion: Suggestion) => {
        if (suggestion.imageUrls[0]) {
          await utapi.deleteFiles(extractFileKey(suggestion.imageUrls[0]), { keyType: "fileKey" })
        }
      })

      await utapi.deleteFiles(board.logoKey, { keyType: "fileKey" })
      await utapi.deleteFiles(board.faviconKey, { keyType: "fileKey" })

      const result = await collection.deleteOne({ urlName })

      return NextResponse.json(
        {
          message: "Board deleted successfully",
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ error: "Board does not exist" }, { status: 500 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error deleting board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
