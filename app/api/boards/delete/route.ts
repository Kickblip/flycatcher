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
  const { urlName } = body

  if (!urlName) {
    return NextResponse.json(
      {
        message: "Board name is required",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    const board = await collection.findOne({ urlName })

    if (board) {
      if (board.author !== userId)
        return NextResponse.json({ message: "User not authorized to delete this board" }, { status: 403 })

      const result = await collection.deleteOne({ urlName })

      return NextResponse.json(
        {
          message: "Board deleted successfully",
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ error: "Board does not exist" }, { status: 500 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
