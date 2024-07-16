import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { createClient } from "@/utils/supabase/server"
import { utapi } from "@/utils/server/uploadthing"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "10 s"),
})

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { suggestionId, boardName } = body

  if (!suggestionId || !boardName) {
    return NextResponse.json(
      {
        message: "Missing required fields",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    const board = await collection.findOne({ urlName: boardName })

    if (board) {
      if (board.author !== user.id) {
        return NextResponse.json({ message: "User not authorized to delete this suggestion" }, { status: 403 })
      }

      const findSuggestionWithIndex = (board: any, suggestionId: string) => {
        const suggestionIndex = board.suggestions.findIndex((suggestion: any) => suggestion.id === suggestionId)
        const suggestion = suggestionIndex !== -1 ? board.suggestions[suggestionIndex] : null
        return { suggestion, suggestionIndex }
      }
      const { suggestion, suggestionIndex } = findSuggestionWithIndex(board, suggestionId)

      if (suggestionIndex !== -1) {
        board.suggestions.splice(suggestionIndex, 1)

        await collection.updateOne({ urlName: boardName }, { $set: { suggestions: board.suggestions } })

        const extractFileKey = (url: string) => {
          const parts = url.split("/")
          const filename = parts[parts.length - 1]
          return filename
        }

        if (suggestion.imageUrls[0]) {
          await utapi.deleteFiles(extractFileKey(suggestion.imageUrls[0]), { keyType: "fileKey" })
        }

        return NextResponse.json(
          {
            message: "Suggestion deleted successfully",
          },
          { status: 200 },
        )
      } else {
        return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: "Board does not exist" }, { status: 404 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error deleting suggestion:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
