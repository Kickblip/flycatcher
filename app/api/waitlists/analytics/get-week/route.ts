import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { analytics } from "@/utils/analytics/analytics"
import clientPromise from "@/utils/mongodb"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 s"),
})

function extractDeviceType(eventKey: string): "desktop" | "mobile" | "unknown" | null {
  if (eventKey.includes('"deviceType":"desktop"')) {
    return "desktop"
  } else if (eventKey.includes('"deviceType":"mobile"')) {
    return "mobile"
  } else if (eventKey === "{}") {
    return "unknown"
  } else {
    return null
  }
}

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

  try {
    const pageViews = await analytics.retrieveDays("pageview", urlName, 7)
    const addedContacts = await analytics.retrieveDays("addcontact", urlName, 7)
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")

    const waitlist = await collection.findOne({ urlName })

    if (!waitlist) {
      return NextResponse.json({ error: "Waitlist not found" }, { status: 404 })
    }

    if (waitlist.author !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const numContacts = waitlist.contacts.length

    // for line chart
    const chartData = pageViews.map((day: { date: string; events: any[] }, index: number) => {
      const pageViewsSum = day.events.reduce((sum, event) => {
        const eventValue = Object.values(event)[0]
        return sum + eventValue
      }, 0)

      const correspondingContactsDay = addedContacts[index]

      const addedContactsSum = correspondingContactsDay.events.reduce((sum, event) => {
        const eventValue = Object.values(event)[0]
        return sum + eventValue
      }, 0)

      return {
        date: day.date,
        pageViews: pageViewsSum,
        pageSignups: addedContactsSum,
      }
    })

    // for pie charts
    const result: Record<string, { deviceType: string; pageViews: number; pageSignups: number }> = {
      desktop: { deviceType: "desktop", pageViews: 0, pageSignups: 0 },
      mobile: { deviceType: "mobile", pageViews: 0, pageSignups: 0 },
      unknown: { deviceType: "unknown", pageViews: 0, pageSignups: 0 },
    }

    pageViews.forEach((day) => {
      day.events.forEach((event) => {
        const deviceType = extractDeviceType(Object.keys(event)[0])
        if (deviceType) {
          result[deviceType].pageViews += Object.values(event)[0]
        }
      })
    })

    addedContacts.forEach((day) => {
      day.events.forEach((event) => {
        const deviceType = extractDeviceType(Object.keys(event)[0])
        if (deviceType) {
          result[deviceType].pageSignups += Object.values(event)[0]
        }
      })
    })

    const deviceData = Object.values(result)

    return NextResponse.json({ chartData, deviceData, numContacts }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error retrieving waitlist:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
