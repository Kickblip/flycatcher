import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Vote } from "@/types/SuggestionBoard"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
})

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  let tracker = ""
  if (!user?.id) {
    tracker = request.headers.get("x-forwarded-for") ?? request.headers.get("remote-addr") ?? ""
  } else {
    tracker = user.id
  }
  const { success, reset } = await ratelimit.limit(tracker)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { suggestionId, board, author } = body

  if (!suggestionId || !board || !author) {
    return NextResponse.json({ message: "Missing suggestionId, board or author" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const matchingBoard = await collection.findOne({ urlName: board.urlName })

    if (!matchingBoard) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    if (matchingBoard.settings.disableAnonVoting && !user?.id) {
      return NextResponse.json({ message: "Anonymous voting is disabled" }, { status: 403 })
    }

    const updatedSuggestions = matchingBoard.suggestions.map((suggestion: Suggestion) => {
      if (suggestion.id === suggestionId) {
        return {
          ...suggestion,
          votes: suggestion.votes.filter((vote: Vote) => vote.author !== author),
        }
      }
      return suggestion
    })

    await collection.updateOne({ urlName: board.urlName }, { $set: { suggestions: updatedSuggestions } })

    return NextResponse.json({ message: "Suggestion added successfully" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error removing vote:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
