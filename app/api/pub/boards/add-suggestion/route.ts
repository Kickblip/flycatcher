import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion } from "@/types/SuggestionBoard"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  const body = await request.json()
  const { title, description, board, author } = body

  if (!title || !description || !board || !author) {
    return NextResponse.json(
      {
        message: "Missing title, description, board, or author",
      },
      { status: 400 },
    )
  }

  if (title.length > 250 || description.length > 500) {
    return NextResponse.json(
      {
        message: "Title must be less than 250 characters and description must be less than 500 characters",
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
      id: uuidv4(),
      author: author,
      title,
      description,
      votes: [],
      status: "new",
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedSuggestions = [...matchingBoard.suggestions, newSuggestion]

    // sort suggestions by votes
    updatedSuggestions.sort((a, b) => b.votes - a.votes)

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
