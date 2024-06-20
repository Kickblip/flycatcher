import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion } from "@/types/SuggestionBoard"

export async function POST(request: Request) {
  const body = await request.json()
  const { title, description, board } = body

  if (!title || !description || !board) {
    return NextResponse.json(
      {
        message: "Missing title, description, or board",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const matchingBoard = await collection.findOne({ urlName: board.urlName })

    if (!matchingBoard) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    // add the new suggestion to the board
    const newSuggestion: Suggestion = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      votes: 0,
      status: "new",
      comments: [],
    }

    const updatedSuggestions = [...matchingBoard.suggestions, newSuggestion]

    await collection.updateOne({ urlName: board.urlName }, { $set: { suggestions: updatedSuggestions } })

    return NextResponse.json({ message: "Suggestion added successfully", suggestion: newSuggestion }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
