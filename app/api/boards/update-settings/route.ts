import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { currentUser } from "@clerk/nextjs/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 s"),
})

export async function POST(request: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }
  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { boardUrlName } = body
  let { disableBranding, metadataTabTitle, disableAnonVoting } = body
  const forceSignIn = false // temp until this maybe becomes a feature

  if (
    !metadataTabTitle ||
    typeof forceSignIn !== "boolean" ||
    typeof disableBranding !== "boolean" ||
    typeof disableAnonVoting !== "boolean" ||
    !boardUrlName
  ) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  metadataTabTitle = metadataTabTitle.trim()

  if (metadataTabTitle.length > 60) {
    return NextResponse.json({ message: "Metadata tab title too long" }, { status: 400 })
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
            "settings.disableAnonVoting": disableAnonVoting,
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
