import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
})

export async function GET(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")

    // count the number of waitlists where the user is listed as the author
    const waitlists = await collection.find({ author: user.id }).toArray()

    // total the suggestions for all those boards
    const totalContacts = waitlists.reduce((acc, waitlist) => acc + (waitlist.contacts.length || 0), 0)

    const waitlistDetails = waitlists.map((waitlist) => ({
      name: waitlist.name,
      contacts: waitlist.contacts.length || 0,
    }))

    return NextResponse.json({ waitlistDetails, totalContacts }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error fetching usage data:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
