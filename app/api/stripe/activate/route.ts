import { NextResponse } from "next/server"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(user.publicMetadata.stripeSubscriptionId as string)
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }
    if (!subscription.cancel_at_period_end) {
      return NextResponse.json({ error: "Subscription already active" }, { status: 400 })
    }

    await stripe.subscriptions.update(user.publicMetadata.stripeSubscriptionId as string, {
      cancel_at_period_end: false,
    })

    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        stripeSubscriptionCancelAtPeriodEnd: false,
      },
    })

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
