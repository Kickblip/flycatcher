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

    if (matchingWaitlist.contacts.length >= Number(process.env.NEXT_PUBLIC_CONTACT_HARD_LIMIT!)) {
      return NextResponse.json({ message: "Contact limit reached" }, { status: 200 })
    }

    const existingContact = matchingWaitlist.contacts?.find((contact) => contact.email === email)

    if (existingContact) {
      return NextResponse.json({ message: "Contact with this email already exists" }, { status: 409 })
    }

    const newContact: Contact = {
      id: uuidv4(),
      email,
      fields: {},
      createdAt: new Date(),
    }

    await collection.updateOne({ urlName }, { $addToSet: { contacts: newContact } })

    const userAgent = request.headers.get("user-agent") || ""
    let deviceType: string
    if (!userAgent) {
      deviceType = "unknown"
    } else {
      const isMobile = /mobile/i.test(userAgent)
      deviceType = isMobile ? "mobile" : "desktop"
    }
    await analytics.track("addcontact", urlName, { country: request.geo?.country, deviceType: deviceType })
    return NextResponse.json({ message: "Contact added successfully" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error adding contact:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
