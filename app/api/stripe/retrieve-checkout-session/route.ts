import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/utils/supabase/service"
import { createClient } from "@/utils/supabase/server"
import { updateBoardOwnerPremiumStatus } from "@/utils/actions/updateBoardOwnerPremiumStatus"
import Stripe from "stripe"

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
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const sessionId: string = body.sessionId

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "No session ID provided." }, { status: 400 })
    }

    const { data: userMetadata, error: userMetadataError } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // let previousCheckoutSessionIds: string[] = []
    // if (!userMetadataError) {
    //   previousCheckoutSessionIds = Array.isArray(userMetadata?.checkout_session_ids) ? userMetadata.checkout_session_ids : []
    //   if (previousCheckoutSessionIds.includes(sessionId)) {
    //     return NextResponse.json({ success: true, error: null }, { status: 200 })
    //   }
    // }

    let previousCheckoutSessionIds: string[] = []
    if (!userMetadataError && userMetadata?.checkout_session_ids) {
      previousCheckoutSessionIds = Array.isArray(userMetadata.checkout_session_ids) ? userMetadata.checkout_session_ids : []
      if (previousCheckoutSessionIds.includes(sessionId)) {
        return NextResponse.json({ success: true, error: null }, { status: 200 })
      }
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id

    let isPremium = false
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      isPremium = subscription.status === "active"
    }

    const updatedMetadata = {
      checkout_session_ids: [...previousCheckoutSessionIds, sessionId],
      stripe_subscription_id: subscriptionId,
      stripe_current_period_end: typeof session.subscription === "string" ? undefined : session.subscription?.current_period_end,
      is_premium: isPremium,
      stripe_subscription_status: typeof session.subscription === "string" ? undefined : session.subscription?.status,
      stripe_subscription_cancel_at_period_end:
        typeof session.subscription === "string" ? undefined : session.subscription?.cancel_at_period_end,
      stripe_customer_id: session.customer,
    }

    const supabaseServiceClient = createServiceRoleClient()

    const { data: updateData, error: updateError } = await supabaseServiceClient.from("user").upsert({
      user_id: user.id,
      ...updatedMetadata,
    })

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to update user metadata." }, { status: 500 })
    }

    if (isPremium) {
      await updateBoardOwnerPremiumStatus(user.id, isPremium)
    }

    return NextResponse.json({ success: true, error: null }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating checkout session:", errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
