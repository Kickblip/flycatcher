import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Comment, Vote, Reply } from "@/types/SuggestionBoard"
import { auth } from "@clerk/nextjs/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

export async function GET(request: Request, { params }: { params: { board_name: string } }) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("remote-addr") ?? ""

  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const urlName = params.board_name
  const { userId } = auth()

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName }, { projection: { author: 0, suggestions: { $slice: 10 } } })

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        { status: 404 },
      )
    }

    // sanitize the board data but keep instances where the userId is the author
    const sanitizedBoard = {
      ...board,
      suggestions: board.suggestions.map((suggestion: Suggestion) => ({
        ...suggestion,
        author: userId ? (suggestion.author === userId ? suggestion.author : undefined) : undefined,
        votes: suggestion.votes.map((vote: Vote) => ({
          ...vote,
          author: userId ? (vote.author === userId ? vote.author : undefined) : undefined,
        })),
        comments: suggestion.comments.map((comment: Comment) => ({
          ...comment,
          author: userId ? (comment.author === userId ? comment.author : undefined) : undefined,
          replies: comment.replies.map((reply: Reply) => ({
            ...reply,
            author: userId ? (reply.author === userId ? reply.author : undefined) : undefined,
          })),
        })),
      })),
    }

    return NextResponse.json(sanitizedBoard, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error getting board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
