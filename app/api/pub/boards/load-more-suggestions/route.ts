import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Comment, Vote, Reply } from "@/types/SuggestionBoard"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
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
  const { urlName, page = 2 } = body
  const limit = 10
  const skip = (page - 1) * limit

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName }, { projection: { author: 0, suggestions: { $slice: [skip, limit] } } })

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        { status: 404 },
      )
    }

    const sanitizedSuggestions = board.suggestions.map((suggestion: Suggestion) => ({
      ...suggestion,
      author: user?.id ? (suggestion.author === user?.id ? suggestion.author : undefined) : undefined,
      votes: suggestion.votes.map((vote: Vote) => ({
        ...vote,
        author: user?.id ? (vote.author === user?.id ? vote.author : undefined) : undefined,
      })),
      comments: suggestion.comments.map((comment: Comment) => ({
        ...comment,
        author: user?.id ? (comment.author === user?.id ? comment.author : undefined) : undefined,
        replies: comment.replies.map((reply: Reply) => ({
          ...reply,
          author: user?.id ? (reply.author === user?.id ? reply.author : undefined) : undefined,
        })),
      })),
    }))

    return NextResponse.json(sanitizedSuggestions, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error loading more suggestions:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
