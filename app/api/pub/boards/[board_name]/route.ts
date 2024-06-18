import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"

export async function GET(request: Request, { params }: { params: { board_name: string } }) {
  const urlName = params.board_name

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName }, { projection: { author: 0 } })

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(board, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
