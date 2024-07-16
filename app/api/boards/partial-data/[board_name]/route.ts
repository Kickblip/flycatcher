import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 s"),
})

export async function GET(request: Request, { params }: { params: { board_name: string } }) {
  const urlName = params.board_name
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const board = await collection.findOne({ urlName }, { projection: { suggestions: 0 } })

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        { status: 404 },
      )
    }

    if (board.author !== user.id) {
      return NextResponse.json(
        {
          message: "User not authorized to view this board",
        },
        { status: 403 },
      )
    }

    return NextResponse.json(board, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error retrieving board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
