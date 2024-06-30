import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    // count the number of boards where the user is listed as the author
    const boards = await collection.find({ author: user.id }).toArray()
    const boardCount = boards.length

    // total the suggestions for all those boards
    const totalSuggestions = boards.reduce((acc, board) => acc + (board.suggestions.length || 0), 0)

    return NextResponse.json({ boardCount, totalSuggestions }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error fetching usage data:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
