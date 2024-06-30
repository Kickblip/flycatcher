import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json(
      {
        message: "User not authenticated",
      },
      { status: 401 },
    )
  }

  const body = await request.json()
  const { boardUrlName } = body
  let { disableBranding, metadataTabTitle } = body
  const forceSignIn = false // temp until this maybe becomes a feature

  if (!metadataTabTitle || typeof forceSignIn !== "boolean" || typeof disableBranding !== "boolean" || !boardUrlName) {
    return NextResponse.json(
      {
        message: "Missing required fields",
      },
      { status: 400 },
    )
  }

  metadataTabTitle = metadataTabTitle.trim()

  if (metadataTabTitle.length > 60) {
    return NextResponse.json(
      {
        message: "Metadata tab title too long",
      },
      { status: 400 },
    )
  }

  if (disableBranding === true && !user.publicMetadata.isPremium) {
    disableBranding = false
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    let oldBoard = await collection.findOne({ urlName: boardUrlName })

    if (oldBoard) {
      if (oldBoard.author !== user.id)
        return NextResponse.json({ message: "User not authorized to update this board" }, { status: 403 })

      await collection.updateOne(
        { urlName: boardUrlName },
        {
          $set: {
            "settings.forceSignIn": forceSignIn,
            "settings.disableBranding": disableBranding,
            metadataTabTitle,
          },
        },
      )

      return NextResponse.json(
        {
          message: "Board updated successfully",
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
    console.error("Error updating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
