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
  const { suggestionId, boardName } = body

  if (!suggestionId || !boardName) {
    return NextResponse.json(
      {
        message: "Missing required fields",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    const board = await collection.findOne({ urlName: boardName })

    if (board) {
      if (board.author !== userId) {
        return NextResponse.json({ message: "User not authorized to delete this suggestion" }, { status: 403 })
      }

      const suggestionIndex = board.suggestions.findIndex((suggestion: any) => suggestion.id === suggestionId)

      if (suggestionIndex !== -1) {
        board.suggestions.splice(suggestionIndex, 1)

        await collection.updateOne({ urlName: boardName }, { $set: { suggestions: board.suggestions } })

        return NextResponse.json(
          {
            message: "Suggestion deleted successfully",
          },
          { status: 200 },
        )
      } else {
        return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: "Board does not exist" }, { status: 404 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error deleting suggestion:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
