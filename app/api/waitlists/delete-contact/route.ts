import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { WaitlistPage } from "@/types/WaitlistPage"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "5 s"),
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
  const { urlName, contactId } = body

  if (!urlName || !contactId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")
    let waitlist = (await collection.findOne({ urlName })) as WaitlistPage | null

    if (!waitlist) {
      return NextResponse.json({ message: "Waitlist does not exist" }, { status: 500 })
    }

    if (waitlist.author !== user.id)
      return NextResponse.json({ message: "User not authorized to update this waitlist" }, { status: 403 })

    const result = await collection.updateOne({ urlName }, { $pull: { contacts: { id: contactId } as any } })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Contact not found or already removed" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact removed successfully" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error removing contact:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
