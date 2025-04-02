import Stripe from "stripe"
import { NextResponse, NextRequest } from "next/server"
import { createServiceRoleClient } from "@/utils/supabase/service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const res = JSON.parse(payload)
  const sig = req.headers.get("Stripe-Signature")

  try {
    let event = stripe.webhooks.constructEvent(payload, sig!, process.env.STRIPE_WEBHOOK_SECRET!)

    const email = res?.data?.object?.receipt_email
    const customer = res?.data?.object?.customer

    if (event.type === "checkout.session.completed") {
      const supabaseServiceClient = createServiceRoleClient()

      if (!email) {
        console.error("No email found in checkout session.")
        return NextResponse.json({ status: "failed", reason: "No email" }, { status: 400 })
      }

      const { data: authUser, error: authUserError } = await supabaseServiceClient
        .from("auth.users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (authUserError || !authUser) {
        console.error("Could not find user by email in auth table", authUserError)
        return NextResponse.json({ status: "failed", reason: "User not found" }, { status: 404 })
      }

      const { data, error } = await supabaseServiceClient
        .from("user")
        .upsert({
          user_id: authUser.id,
          is_premium: true,
          email: email,
          stripe_customer_id: customer,
        })
        .select()
        .single()

      if (error) {
        console.error("Error upserting user in Supabase:", error)
        return NextResponse.json({ status: "failed", error }, { status: 500 })
      }
    }

    return NextResponse.json({ status: "success", message: "Webhook processed" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: "failed", error }, { status: 400 })
  }
}
