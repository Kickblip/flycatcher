import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { auth } from "@clerk/nextjs/server"

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

  const body = await request.json()
  const { suggestionId, commentId, boardName } = body

  if (!suggestionId || !boardName || !commentId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    const board = await collection.findOne({ urlName: boardName })

    if (!board) {
      return NextResponse.json({ error: "Board does not exist" }, { status: 404 })
    }
    if (board.author !== userId) {
      return NextResponse.json({ message: "User not authorized to delete this comment" }, { status: 403 })
    }

    const suggestion = board.suggestions.find((s: any) => s.id === suggestionId)

    if (!suggestion) {
      return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
    }

    const deleteCommentById = (comments: any[], commentId: string) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === commentId) {
          comments.splice(i, 1)
          return true
        }

        if (comments[i].replies) {
          const foundInReplies = deleteCommentById(comments[i].replies, commentId)
          if (foundInReplies) {
            return true
          }
        }
      }
      return false
    }

    const commentDeleted = deleteCommentById(suggestion.comments, commentId)

    if (!commentDeleted) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    await collection.updateOne(
      { urlName: boardName, "suggestions.id": suggestionId },
      { $set: { "suggestions.$.comments": suggestion.comments } },
    )

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error deleting comment:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
