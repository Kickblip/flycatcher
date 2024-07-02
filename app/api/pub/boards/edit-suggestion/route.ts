import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { auth } from "@clerk/nextjs/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  const { success, reset } = await ratelimit.limit(userId)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { suggestionId, boardUrlName } = body
  const title = body.title.trim()
  const description = body.description.trim()

  if (!title || !suggestionId || !boardUrlName || !description) {
    return NextResponse.json(
      {
        message: "Missing required fields",
      },
      { status: 400 },
    )
  }

  if (title.length > 250 || description.length > 500) {
    return NextResponse.json(
      {
        message: "Text fields too long",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName: boardUrlName })

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    if (board.author !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await collection.updateOne(
      { urlName: boardUrlName, "suggestions.id": suggestionId },
      {
        $set: {
          "suggestions.$.title": title,
          "suggestions.$.description": description,
          "suggestions.$.updatedAt": new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Suggestion updated successfully" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error updating suggestion:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
