import { NextResponse } from "next/server"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { updateBoardOwnerPremiumStatus } from "@/utils/actions/updateBoardOwnerPremiumStatus"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const sessionId: string = body.sessionId

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "No session ID provided." }, { status: 400 })
    }

    const previousCheckoutSessionIds = Array.isArray(user.publicMetadata.checkoutSessionIds)
      ? user.publicMetadata.checkoutSessionIds
      : []

    if (previousCheckoutSessionIds.includes(sessionId)) {
      return NextResponse.json({ success: true, error: null }, { status: 200 })
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

    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        checkoutSessionIds: [...previousCheckoutSessionIds, sessionId],
        stripeSubscriptionId: subscriptionId,
        stripeCurrentPeriodEnd: typeof session.subscription === "string" ? undefined : session.subscription?.current_period_end,
        isPremium,
        stripeSubscriptionStatus: typeof session.subscription === "string" ? undefined : session.subscription?.status,
        stripeSubscriptionCancelAtPeriodEnd:
          typeof session.subscription === "string" ? undefined : session.subscription?.cancel_at_period_end,
      },
      privateMetadata: {
        stripeCustomerId: session.customer,
      },
    })

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
