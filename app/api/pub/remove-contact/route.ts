import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { v4 as uuidv4 } from "uuid"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { Contact, WaitlistPage } from "@/types/WaitlistPage"
import { type NextRequest } from "next/server"
import { analytics } from "@/utils/analytics/analytics"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "30 s"),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("remote-addr") ?? ""

  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { urlName, email } = body

  if (!urlName || !email) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return NextResponse.json({ message: "Email address invalid format" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")

    const matchingWaitlist = (await collection.findOne({ urlName })) as WaitlistPage

    if (!matchingWaitlist) {
      return NextResponse.json({ message: "Waitlist not found" }, { status: 404 })
    }

    await collection.updateOne({ urlName }, { $pull: { contacts: { email } as any } })

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
