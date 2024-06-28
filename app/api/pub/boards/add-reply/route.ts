import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Reply, Comment } from "@/types/SuggestionBoard"
import { v4 as uuidv4 } from "uuid"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { reply, commentId, suggestionId, boardUrlName } = body

  if (!reply || !commentId || !suggestionId) {
    return NextResponse.json(
      {
        message: "Missing reply or commentId or suggestionId",
      },
      { status: 400 },
    )
  }

  if (reply.length > 350) {
    return NextResponse.json(
      {
        message: "Reply must be less than 350 characters",
      },
      { status: 400 },
    )
  }

  const newReply: Reply = {
    id: uuidv4(),
    author: user.id,
    authorName: user.username || user.firstName || "Anonymous",
    authorImg: user.imageUrl || "https://flycatcher.app/board-pages/default-pfp.png",
    isOwnerMessage: false,
    content: reply,
    createdAt: new Date(),
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName: boardUrlName })

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    const suggestionIndex = board.suggestions.findIndex((s: Suggestion) => s.id === suggestionId)
    if (suggestionIndex === -1) {
      return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
    }

    const commentIndex = board.suggestions[suggestionIndex].comments.findIndex((c: Comment) => c.id === commentId)
    if (commentIndex === -1) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 })
    }

    // Update the specific comment with the new reply
    const updatePath = `suggestions.${suggestionIndex}.comments.${commentIndex}.replies`

    await collection.updateOne({ urlName: boardUrlName }, { $push: { [updatePath]: newReply } as any })

    return NextResponse.json({ message: "Comment added successfully", newReply }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
