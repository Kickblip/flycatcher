import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { currentUser } from "@clerk/nextjs/server"
import { Board } from "@/types/SuggestionBoard"
import Stripe from "stripe"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }

  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  let { name } = body

  if (!name) {
    return NextResponse.json({ message: "Board name is required" }, { status: 400 })
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
        message: "Board name must be less than 60 characters",
      },
      { status: 400 },
    )
  }

  let isPremium = false
  if (user.publicMetadata.stripeSubscriptionId) {
    // check their subscription status
    const subscription = await stripe.subscriptions.retrieve(user.publicMetadata.stripeSubscriptionId as string)
    isPremium = subscription.status === "active"
  }

  const newBoard: Board = {
    name,
    urlName: name.toLowerCase().replace(/\s+/g, "-"),
    logo: "",
    logoKey: "",
    favicon: "",
    faviconKey: "",
    metadataTabTitle: `Feedback | ${name}`,
    primaryColor: "#ffffff",
    secondaryColor: "#f3f4f6", // gray-100
    accentColor: "#6366f1", // indigo-500
    textColor: "#000000",
    author: user.id,
    suggestions: [],
    settings: {
      forceSignIn: false,
      disableBranding: false,
      disableAnonVoting: false,
    },
    createdAt: new Date(),
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    // get the total amount of boards the user currently has
    const boards = await collection.find({ author: user.id }).toArray()

    if (!isPremium && boards.length >= 1) {
      // 1 is the limit for free users
      return NextResponse.json(
        {
          message: "Exceeded board limit",
        },
        { status: 403 },
      )
    }

    if (isPremium && boards.length >= 10) {
      // 10 is the limit for premium users
      return NextResponse.json(
        {
          message: "Exceeded board limit",
        },
        { status: 403 },
      )
    }

    // check if a board with the same name already exists (case-insensitive)
    const existingBoard = await collection.findOne({ urlName: new RegExp(`^${name.toLowerCase().replace(/\s+/g, "-")}$`, "i") })
    if (existingBoard) {
      return NextResponse.json(
        {
          message: "Board name already exists",
        },
        { status: 409 },
      )
    }

    const result = await collection.insertOne(newBoard)
    return NextResponse.json(
      {
        message: "Board created successfully",
        board: newBoard,
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
