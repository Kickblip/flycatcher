import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json(
      {
        message: "User not authenticated",
      },
      { status: 401 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const userBoards = await collection.find({ author: userId }).toArray()

    return NextResponse.json(
      {
        message: "Boards retrieved successfully",
        boards: userBoards,
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error getting board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
