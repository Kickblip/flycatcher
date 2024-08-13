import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { WaitlistPage } from "@/types/WaitlistPage"
import { revalidatePath } from "next/cache"

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
  const { waitlist }: { waitlist: WaitlistPage } = body

  if (!waitlist) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  if (waitlist.settings.metadataTabTitle.length > 60) {
    return NextResponse.json({ message: "Metadata tab title must be less than 60 characters" }, { status: 400 })
  }

  if (waitlist.settings.titleText.length > 700) {
    return NextResponse.json({ message: "Title text must be less than 700 characters" }, { status: 400 })
  }

  if (waitlist.settings.subtitleText.length > 1500) {
    return NextResponse.json({ message: "Subtitle text must be less than 1500 characters" }, { status: 400 })
  }

  //   const { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user.id).single()
  //   let isPremium = false
  //   if (!userMetadataError) {
  //     if (userMetadata?.is_premium) isPremium = true
  //   }

  //   if (disableBranding === true && !isPremium) {
  //     disableBranding = false
  //   }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")
    let oldWaitlist = await collection.findOne({ urlName: waitlist.urlName })

    if (!oldWaitlist) {
      return NextResponse.json({ message: "Waitlist does not exist" }, { status: 500 })
    }

    if (oldWaitlist.author !== user.id)
      return NextResponse.json({ message: "User not authorized to update this waitlist" }, { status: 403 })

    await collection.updateOne(
      { urlName: waitlist.urlName },
      {
        $set: {
          "settings.primaryColor": waitlist.settings.primaryColor,
          "settings.secondaryColor": waitlist.settings.secondaryColor,
          "settings.accentColor": waitlist.settings.accentColor,
          "settings.textColor": waitlist.settings.textColor,
          "settings.metadataTabTitle": waitlist.settings.metadataTabTitle,
          "settings.titleText": waitlist.settings.titleText,
          "settings.subtitleText": waitlist.settings.subtitleText,
          "settings.submitButtonText": waitlist.settings.submitButtonText,
          "socialLinks.twitter": waitlist.socialLinks.twitter,
          "socialLinks.facebook": waitlist.socialLinks.facebook,
          "socialLinks.instagram": waitlist.socialLinks.instagram,
          "socialLinks.linkedin": waitlist.socialLinks.linkedin,
          "socialLinks.youtube": waitlist.socialLinks.youtube,
          "socialLinks.tiktok": waitlist.socialLinks.tiktok,
        },
      },
    )

    revalidatePath(`/w/${waitlist.urlName}`)

    return NextResponse.json(
      {
        message: "Waitlist updated successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error updating waitlist:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
