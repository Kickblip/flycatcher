import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 s"),
})

export async function POST(request: Request) {
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

  const body = await request.json()
  const { urlName, primaryColor, secondaryColor, accentColor, textColor } = body

  if (!urlName) {
    return NextResponse.json({ message: "Board name is required" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")
    let oldBoard = await collection.findOne({ urlName })

    if (oldBoard) {
      if (oldBoard.author !== user.id)
        return NextResponse.json({ message: "User not authorized to update this board" }, { status: 403 })

      const updatedBoard = {
        ...(primaryColor && { primaryColor }),
        ...(secondaryColor && { secondaryColor }),
        ...(accentColor && { accentColor }),
        ...(textColor && { textColor }),
      }

      await collection.updateOne({ urlName }, { $set: updatedBoard })

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
