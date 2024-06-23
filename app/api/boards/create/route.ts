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
  let { name } = body

  if (!name) {
    return NextResponse.json(
      {
        message: "Board name is required",
      },
      { status: 400 },
    )
  }

  name = name.trim()

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return NextResponse.json(
      {
        message: "Special characters not allowed",
      },
      { status: 400 },
    )
  }

  if (name.length > 60) {
    return NextResponse.json(
      {
        message: "Board name must be less than 60 characters",
      },
      { status: 400 },
    )
  }

  const newBoard = {
    name,
    urlName: name.toLowerCase().replace(/\s+/g, "-"),
    logo: "",
    favicon: "",
    primaryColor: "#ffffff",
    secondaryColor: "#f3f4f6", // gray-100
    accentColor: "#6366f1", // indigo-500
    textColor: "#000000",
    author: userId,
    suggestions: [],
    settings: {
      forceSignIn: false,
    },
  }

  console.log("Creating board:", newBoard)

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    // check if a board with the same name already exists (case-insensitive)
    const existingBoard = await collection.findOne({ urlName: new RegExp(`^${name.toLowerCase().replace(/\s+/g, "-")}$`, "i") })
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
