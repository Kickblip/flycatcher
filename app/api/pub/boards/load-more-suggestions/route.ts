import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"

export async function POST(request: Request) {
  const body = await request.json()
  const { urlName, page = 2 } = body
  const limit = 10
  const skip = (page - 1) * limit

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName }, { projection: { author: 0, suggestions: { $slice: [skip, limit] } } })

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(board.suggestions, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
