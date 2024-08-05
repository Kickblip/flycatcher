import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Board } from "@/types/SuggestionBoard"
import Stripe from "stripe"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { starterTags } from "../../projects/create/tags"
import { createClient } from "@/utils/supabase/server"
import { Project } from "@/types/Project"
import { WaitlistPage } from "@/types/WaitlistPage"

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

  const { data: userMetadata, error: userMetadataError } = await supabase.from("user").select("*").eq("user_id", user.id).single()
  let isPremium = false
  if (!userMetadataError) {
    const stripeSubscriptionId = userMetadata?.stripe_subscription_id
    if (stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string)
      isPremium = subscription.status === "active"
    }
  }

  const urlName = name.toLowerCase().replace(/\s+/g, "-")

  const newBoard: Board = {
    name,
    urlName,
    author: user.id,
    authorIsPremium: isPremium,
    activeTags: starterTags,
    allTags: starterTags,
    suggestions: [],
    settings: {},
    createdAt: new Date(),
  }

  const newWaitlist: WaitlistPage = {
    name,
    urlName,
    author: user.id,
    createdAt: new Date(),
  }

  try {
    const client = await clientPromise
    const db = client.db("Main")
    const boardsCollection = db.collection("boards")
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

    // insert the new board
    const boardResult = await boardsCollection.insertOne(newBoard)
    const newBoardId = boardResult.insertedId

    // insert the new waitlist page
    const waitlistResult = await waitlistCollection.insertOne(newWaitlist)
    const newWaitlistPageId = waitlistResult.insertedId

    const newProject: Project = {
      author: user.id,
      name,
      urlName,
      settings: {
        feedbackMetadataTabTitle: `Feedback | ${name}`,
        disableBranding: false,
        disableAnonVoting: false,
        logo: "",
        logoKey: "",
        favicon: "",
        faviconKey: "",
        primaryColor: "#ffffff",
        secondaryColor: "#f3f4f6", // gray-100
        accentColor: "#6366f1", // indigo-500
        textColor: "#000000",
      },
      feedbackBoardId: newBoardId,
      waitlistPageId: newWaitlistPageId,
      createdAt: new Date(),
    }

    const projectResult = await projectsCollection.insertOne(newProject)

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
