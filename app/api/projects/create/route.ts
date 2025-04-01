import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import Stripe from "stripe"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"
import { Project } from "@/types/Project"
import { WaitlistPage } from "@/types/WaitlistPage"
import { revalidatePath } from "next/cache"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
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
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  let { name } = body

  if (!name) {
    return NextResponse.json({ message: "Project name is required" }, { status: 400 })
  }

  name = name.trim()

  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return NextResponse.json(
      {
        message: "Special characters not allowed",
      },
      { status: 400 },
    )
  }

  if (name.length > 60) {
    return NextResponse.json(
      {
        message: "Project name must be less than 60 characters",
      },
      { status: 400 },
    )
  }

  // const { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user.id).single()
  // let isPremium = false
  // if (!userMetadataError) {
  //   const stripePurchaseId = userMetadata?.stripe_purchase_id
  //   if (stripePurchaseId) {
  //     const purchase = await stripe.subscriptions.retrieve(stripePurchaseId as string)
  //     isPremium = purchase.status === "active"
  //   }
  // }

  const { data: userMetadata, error: userMetadataError } = await supabase
    .from("user")
    .select("stripe_session_id")
    .eq("user_id", user.id)
    .single()

  let isPremium = false

  if (!userMetadataError && userMetadata?.stripe_session_id) {
    const session = await stripe.checkout.sessions.retrieve(userMetadata.stripe_session_id)
    isPremium = session.payment_status === "paid"
  }

  const urlName = name.toLowerCase().replace(/\s+/g, "-")

  const newWaitlist: WaitlistPage = {
    name,
    urlName,
    author: user.id,
    authorIsPremium: isPremium,
    uploadedContent: [],
    images: {
      logo: "",
      logoKey: "",
      favicon: "",
      faviconKey: "",
      preview: "",
      previewKey: "",
    },
    contacts: [],
    fields: [],
    socialLinks: {
      twitter: "",
      facebook: "",
      linkedin: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
    settings: {
      primaryColor: "#ffffff",
      secondaryColor: "#f3f4f6", // gray-100
      accentColor: "#FF3300", // redorange-500
      textColor: "#000000",
      metadataTabTitle: `Waitlist | ${name}`,
      titleText: "Get early access!",
      submitButtonText: "Join waitlist",
      subtitleText: "Follow our development journey and be one of the first to have access to our product.",
      disableBranding: false,
    },
    createdAt: new Date(),
  }

  try {
    const client = await clientPromise
    const db = client.db("Main")
    const waitlistCollection = db.collection("waitlists")
    const projectsCollection = db.collection("projects")

    // get the total amount of projects the user currently has
    const projects = await projectsCollection.find({ author: user.id }).toArray()

    if (!isPremium && projects.length >= 1) {
      // 1 is the limit for free users
      return NextResponse.json(
        {
          message: "Exceeded project limit",
        },
        { status: 403 },
      )
    }

    if (isPremium && projects.length >= 10) {
      // 10 is the limit for premium users
      return NextResponse.json(
        {
          message: "Exceeded project limit",
        },
        { status: 403 },
      )
    }

    // check if a project with the same name already exists (case-insensitive)
    const existingProject = await projectsCollection.findOne({
      urlName: new RegExp(`^${name.toLowerCase().replace(/\s+/g, "-")}$`, "i"),
    })
    if (existingProject) {
      return NextResponse.json(
        {
          message: "Project name already exists",
        },
        { status: 409 },
      )
    }

    // insert the new waitlist page
    const waitlistResult = await waitlistCollection.insertOne(newWaitlist)
    revalidatePath(`/w/${urlName}`)
    const newWaitlistPageId = waitlistResult.insertedId

    const newProject: Project = {
      author: user.id,
      name,
      urlName,
      settings: {},
      waitlistPageId: newWaitlistPageId,
      createdAt: new Date(),
    }

    await projectsCollection.insertOne(newProject)

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: newProject,
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating project:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
