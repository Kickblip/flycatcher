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
  const { name } = body

  if (!name) {
    return NextResponse.json(
      {
        message: "Board name is required",
      },
      { status: 400 },
    )
  }

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return NextResponse.json(
      {
        message: "Special characters not allowed",
      },
      { status: 400 },
    )
  }

  const newBoard = {
    name,
    urlName: name.toLowerCase().replace(/\s/g, "-"),
    primaryColor: "#ffffff",
    secondaryColor: "#f3f4f6", // gray-100
    accentColor: "#6366f1", // indigo-500
    textColor: "#000000",
    author: userId,
    suggestions: [],
  }

  console.log("Creating board:", newBoard)

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    // check if a board with the same name already exists (case-insensitive)
    const existingBoard = await collection.findOne({ name: new RegExp(`^${name}$`, "i") })
    if (existingBoard) {
      return NextResponse.json(
        {
          message: "Board name already exists",
        },
        { status: 409 },
      )
    }

    const result = await collection.insertOne(newBoard)
    return NextResponse.json(
      {
        message: "Board created successfully",
        board: newBoard,
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
