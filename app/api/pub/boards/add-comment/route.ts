import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion } from "@/types/SuggestionBoard"

export async function POST(request: Request) {
  const body = await request.json()
  const { comment, suggestionId, author } = body
  const boardUrlName = body.board.urlName

  if (!comment || !suggestionId) {
    return NextResponse.json(
      {
        message: "Missing comment or suggestionId",
      },
      { status: 400 },
    )
  }

  if (comment.length > 350) {
    return NextResponse.json(
      {
        message: "Comment must be less than 350 characters",
      },
      { status: 400 },
    )
  }

  const newComment = {
    author,
    isOwnerMessage: false,
    content: comment,
    createdAt: new Date(),
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName: boardUrlName })

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    // find the suggestion by suggestionId and update it with the new comment
    const updatedSuggestions = board.suggestions.map((suggestion: Suggestion) => {
      if (suggestion.id === suggestionId) {
        return {
          ...suggestion,
          comments: [...suggestion.comments, newComment],
        }
      }
      return suggestion
    })

    await collection.updateOne({ urlName: boardUrlName }, { $set: { suggestions: updatedSuggestions } })

    return NextResponse.json({ message: "Comment added successfully", newComment }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
