import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

export async function GET(request: Request, { params }: { params: { waitlist_name: string } }) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("remote-addr") ?? ""

  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const urlName = params.waitlist_name

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")

    const waitlist = await collection.findOne({ urlName })

    if (!waitlist) {
      return NextResponse.json(
        {
          message: "Waitlist not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(waitlist, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error getting waitlist:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
