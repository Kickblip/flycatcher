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
  const { urlName } = body
  const { primaryColor, secondaryColor, accentColor, textColor } = body.settings

  if (!urlName) {
    return NextResponse.json({ message: "Project name is required" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("projects")
    let oldProject = await collection.findOne({ urlName })

    if (oldProject) {
      if (oldProject.author !== user.id)
        return NextResponse.json({ message: "User not authorized to update this project" }, { status: 403 })

      const updatedSettings = {
        ...oldProject.settings,
        ...(primaryColor && { primaryColor }),
        ...(secondaryColor && { secondaryColor }),
        ...(accentColor && { accentColor }),
        ...(textColor && { textColor }),
      }

      await collection.updateOne({ urlName }, { $set: { settings: updatedSettings } })

      return NextResponse.json(
        {
          message: "Project updated successfully",
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ error: "Project does not exist" }, { status: 500 })
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error updating project:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
