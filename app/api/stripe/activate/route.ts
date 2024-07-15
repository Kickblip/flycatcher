import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, "10 s"),
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }
  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  try {
    const { data: userMetadata, error: userMetadataError } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", user.id)
      .single()

    let subscription
    let stripeSubscriptionId
    if (!userMetadataError) {
      stripeSubscriptionId = userMetadata?.stripe_subscription_id
      if (stripeSubscriptionId) {
        subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string)
      }
    }

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }
    if (!subscription.cancel_at_period_end) {
      return NextResponse.json({ error: "Subscription already active" }, { status: 400 })
    }

    await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: false,
    })

    const { error } = await supabase
      .from("user_metadata")
      .update({ stripe_subscription_cancel_at_period_end: false })
      .eq("user_id", user.id)

    return NextResponse.json({ message: "Subscription activated" }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error activating subscription:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
