import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { EmailTemplate } from "@/types/EmailTemplate"
import mailgun from "mailgun.js"
import formData from "form-data"
import { render } from "@react-email/render"
import EmailTemplateFiller from "../EmailTemplateFiller"
import clientPromise from "@/utils/mongodb"
import { WaitlistPage } from "@/types/WaitlistPage"
import { Campaign } from "@/types/Campaign"
import { v4 as uuidv4 } from "uuid"
import Stripe from "stripe"
import { startOfMonth } from "date-fns"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

const mg = new mailgun(formData)
const mgClient = mg.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
})

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }
  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user.id).single()
  let isPremium = false
  if (!userMetadataError) {
    const stripeSubscriptionId = userMetadata?.stripe_subscription_id
    if (stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string)
      isPremium = subscription.status === "active"
    }
  }
  if (!isPremium) {
    return NextResponse.json({ message: "Upgrade to premium to send campaigns" }, { status: 403 })
  }

  const body = await request.json()
  const { template }: { template: EmailTemplate } = body
  const { projectName, urlName } = body
  if (template.blocks.length === 0) {
    return NextResponse.json({ message: "Email cannot be empty" }, { status: 400 })
  }

  if (!projectName || !urlName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const waitlistCollection = client.db("Main").collection("waitlists")
    const campaignCollection = client.db("Main").collection("campaigns")
    const waitlist = (await waitlistCollection.findOne({ urlName })) as WaitlistPage

    if (!waitlist) {
      return NextResponse.json(
        {
          message: "Waitlist not found",
        },
        { status: 404 },
      )
    }

    if (waitlist.author !== user.id) {
      return NextResponse.json(
        {
          message: "User not authorized to view this waitlist",
        },
        { status: 403 },
      )
    }

    // DO CAMPAIGN CHECK HERE
    const startOfCurrentMonth = startOfMonth(new Date())

    const currentMonthCampaigns = await campaignCollection
      .find({
        author: user.id,
        createdAt: { $gte: startOfCurrentMonth },
      })
      .toArray()

    const totalRecipients = currentMonthCampaigns.reduce((sum, campaign) => sum + campaign.recipients, 0)

    if (totalRecipients + waitlist.contacts.length > 10000) {
      return NextResponse.json({ message: "Monthly email limit exceeded" }, { status: 403 })
    }

    const contacts = waitlist.contacts.map((contact) => contact.email)

    const html = render(
      <EmailTemplateFiller
        blocks={template.blocks}
        previewText={template.previewText}
        primaryColor={template.colors.primaryColor}
        secondaryColor={template.colors.secondaryColor}
        textColor={template.colors.textColor}
        accentColor={template.colors.accentColor}
        waitlistUrlName={urlName}
        waitlistName={projectName}
      />,
      {
        pretty: true,
      },
    )

    await mgClient.messages
      .create(process.env.MAILGUN_DOMAIN as string, {
        from: `${urlName}@${process.env.MAILGUN_DOMAIN as string}`,
        to: [user.email || "", ...contacts],
        subject: template.subject,
        text: template.previewText,
        html,
      })
      .catch((err) => {
        console.log(err)
        throw new Error("Failed to send test email")
      })

    const newCampaign: Campaign = {
      author: user.id,
      id: uuidv4(),
      subject: template.subject,
      previewText: template.previewText,
      projectUrlName: urlName,
      recipients: contacts.length,
      blocks: template.blocks.map((block) => {
        return {
          id: block.id.trim(),
          fields: block.fields,
        }
      }),
      colors: {
        primaryColor: template.colors.primaryColor,
        secondaryColor: template.colors.secondaryColor,
        textColor: template.colors.textColor,
        accentColor: template.colors.accentColor,
      },
      createdAt: new Date(),
    }

    await campaignCollection.insertOne(newCampaign)

    return NextResponse.json(
      {
        message: "Test email sent successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error sending test email:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
