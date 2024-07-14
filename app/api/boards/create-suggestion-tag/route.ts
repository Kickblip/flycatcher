import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { auth } from "@clerk/nextjs/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
})

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(userId)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { newTag, boardName } = body

  if (!newTag || !boardName) {
    return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    let board = await collection.findOne({ urlName: boardName })

    if (board) {
      if (board.author !== userId) {
        return NextResponse.json({ message: "User not authorized to update this board" }, { status: 403 })
      }

      board.allTags.push(newTag)
      board.activeTags.push(newTag)

      await collection.updateOne({ urlName: boardName }, { $set: { allTags: board.allTags, activeTags: board.activeTags } })

      return NextResponse.json(
        {
          message: "Tag added successfully",
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
    console.error("Error adding new tag:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
