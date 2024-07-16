import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "10 s"),
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
  const { priority, suggestionId, boardName } = body

  if (!priority || !suggestionId || !boardName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    let board = await collection.findOne({ urlName: boardName })

    if (board) {
      if (board.author !== user.id)
        return NextResponse.json({ message: "User not authorized to update this board" }, { status: 403 })

      const suggestionIndex = board.suggestions.findIndex((suggestion: any) => suggestion.id === suggestionId)

      if (suggestionIndex !== -1) {
        board.suggestions[suggestionIndex].priority = priority

        await collection.updateOne({ urlName: boardName }, { $set: { suggestions: board.suggestions } })

        return NextResponse.json(
          {
            message: "Suggestion priority updated successfully",
          },
          { status: 200 },
        )
      } else {
        return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: "Board does not exist" }, { status: 500 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error updating priority:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
