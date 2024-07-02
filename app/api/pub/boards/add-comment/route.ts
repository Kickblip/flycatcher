import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Comment } from "@/types/SuggestionBoard"
import { v4 as uuidv4 } from "uuid"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { suggestionId } = body
  const boardUrlName = body.board.urlName
  const comment = body.comment.trim()

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

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName: boardUrlName })

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    const newComment: Comment = {
      id: uuidv4(),
      author: user.id,
      authorName: user.username || user.firstName || "Anonymous",
      authorImg: user.imageUrl || "https://flycatcher.app/board-pages/default-pfp.png",
      isOwnerMessage: board.author === user.id,
      content: comment,
      createdAt: new Date(),
      replies: [],
    }

    // Find the suggestion by suggestionId to make sure it exists
    const suggestionIndex = board.suggestions.findIndex((suggestion: Suggestion) => suggestion.id === suggestionId)
    if (suggestionIndex === -1) {
      return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
    }

    // Construct the path to the comments array of the specific suggestion
    const updatePath = `suggestions.${suggestionIndex}.comments`

    // Use $push to add the new comment to the comments array of the specific suggestion
    await collection.updateOne({ urlName: boardUrlName }, { $push: { [updatePath]: newComment } as any })

    return NextResponse.json({ message: "Comment added successfully", newComment }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error adding comment:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
