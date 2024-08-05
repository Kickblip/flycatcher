import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

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

  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }
  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { urlName } = body
  let { disableBranding, feedbackMetadataTabTitle } = body

  if (!feedbackMetadataTabTitle || typeof disableBranding !== "boolean" || !urlName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  feedbackMetadataTabTitle = feedbackMetadataTabTitle.trim()

  if (feedbackMetadataTabTitle.length > 60) {
    return NextResponse.json({ message: "Metadata tab title too long" }, { status: 400 })
  }

  const { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user.id).single()
  let isPremium = false
  if (!userMetadataError) {
    if (userMetadata?.is_premium) isPremium = true
  }

  if (disableBranding === true && !isPremium) {
    disableBranding = false
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("projects")
    let oldProject = await collection.findOne({ urlName })

    if (oldProject) {
      if (oldProject.author !== user.id)
        return NextResponse.json({ message: "User not authorized to update this project" }, { status: 403 })

      await collection.updateOne(
        { urlName },
        {
          $set: {
            "settings.disableBranding": disableBranding,
            "settings.feedbackMetadataTabTitle": feedbackMetadataTabTitle,
          },
        },
      )

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
