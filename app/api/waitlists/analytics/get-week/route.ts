import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { analytics } from "@/utils/analytics/analytics"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 s"),
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

  try {
    const pageViews = await analytics.retrieveDays("pageview", urlName, 7)
    const addedContacts = await analytics.retrieveDays("addcontact", urlName, 7)

    const transformedData = pageViews.map((day: { date: string; events: any[] }, index: number) => {
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

    console.log(transformedData)

    return NextResponse.json({ chartData: transformedData }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error retrieving waitlist:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
