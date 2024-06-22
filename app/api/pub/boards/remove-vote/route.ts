import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion, Vote } from "@/types/SuggestionBoard"

export async function POST(request: Request) {
  const body = await request.json()
  const { suggestionId, board, author } = body

  if (!suggestionId || !board || !author) {
    return NextResponse.json({ message: "Missing suggestionId, board or author" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const matchingBoard = await collection.findOne({ urlName: board.urlName })

    if (!matchingBoard) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    const updatedSuggestions = matchingBoard.suggestions.map((suggestion: Suggestion) => {
      if (suggestion.id === suggestionId) {
        return {
          ...suggestion,
          votes: suggestion.votes.filter((vote: Vote) => vote.author !== author),
        }
      }
      return suggestion
    })

    await collection.updateOne({ urlName: board.urlName }, { $set: { suggestions: updatedSuggestions } })

    return NextResponse.json({ message: "Suggestion added successfully" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
