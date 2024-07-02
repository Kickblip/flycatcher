import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Comment, Vote, Reply } from "@/types/SuggestionBoard"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { urlName, page = 2 } = body
  const limit = 10
  const skip = (page - 1) * limit
  const { userId } = auth()

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
