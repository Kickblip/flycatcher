import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ sessionId: null, checkoutError: "User not authenticated" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const lineItems: LineItem[] = body.lineItems

    const origin = process.env.NEXT_PUBLIC_SITE_URL as string

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${origin}/dashboard/subscription/checkout?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/subscription`,
      customer_email: user.emailAddresses[0].emailAddress,
    })

    return NextResponse.json({ sessionId: session.id, checkoutError: null })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating checkout session:", errorMessage)
    return NextResponse.json({ sessionId: null, checkoutError: errorMessage }, { status: 500 })
  }
}
