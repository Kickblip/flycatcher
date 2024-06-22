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
  const { status, suggestionId, boardName } = body

  if (!status || !suggestionId || !boardName) {
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
    let board = await collection.findOne({ urlName: boardName })

    if (board) {
      if (board.author !== userId)
        return NextResponse.json({ message: "User not authorized to update this board" }, { status: 403 })

      const suggestionIndex = board.suggestions.findIndex((suggestion: any) => suggestion.id === suggestionId)

      if (suggestionIndex !== -1) {
        board.suggestions[suggestionIndex].status = status

        await collection.updateOne({ urlName: boardName }, { $set: { suggestions: board.suggestions } })

        return NextResponse.json(
          {
            message: "Suggestion status updated successfully",
          },
          { status: 200 },
        )
      } else {
        return NextResponse.json({ message: "Suggestion not found" }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: "Board does not exist" }, { status: 500 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error updating status:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
