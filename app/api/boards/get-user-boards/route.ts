import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { auth } from "@clerk/nextjs/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 s"),
})

export async function GET(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(userId)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
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
