import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Comment, Vote } from "@/types/SuggestionBoard"

export async function GET(request: Request, { params }: { params: { board_name: string } }) {
  const urlName = params.board_name

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

    const sanitizedBoard = {
      ...board,
      suggestions: board.suggestions.map((suggestion: Suggestion) => ({
        ...suggestion,
        author: undefined,
        votes: suggestion.votes.map((vote: Vote) => ({
          ...vote,
          author: undefined,
        })),
        comments: suggestion.comments.map((comment: Comment) => ({
          ...comment,
          author: undefined,
        })),
      })),
    }

    return NextResponse.json(sanitizedBoard, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
