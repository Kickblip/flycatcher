import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion } from "@/types/SuggestionBoard"
import { v4 as uuidv4 } from "uuid"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { board } = body
  const title = body.title.trim()
  const description = body.description.trim()

  if (!title || !description || !board) {
    return NextResponse.json(
      {
        message: "Missing title, description, or board",
      },
      { status: 400 },
    )
  }

  if (title.length > 250 || description.length > 500) {
    return NextResponse.json(
      {
        message: "Title must be less than 250 characters and description must be less than 500 characters",
      },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const matchingBoard = await collection.findOne({ urlName: board.urlName })

    if (!matchingBoard) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 })
    }

    const authorData = await clerkClient.users.getUser(matchingBoard.author)
    console.log("authorData", authorData)

    let isPremium = false
    if (authorData.publicMetadata.stripeSubscriptionId) {
      // check their subscription status
      const subscription = await stripe.subscriptions.retrieve(user.publicMetadata.stripeSubscriptionId as string)
      isPremium = subscription.status === "active"
    }

    if (matchingBoard.suggestions.length >= 50 && !isPremium) {
      return NextResponse.json({ message: "Reached suggestion limit for board" }, { status: 403 })
    }

    // add the new suggestion to the board
    const newSuggestion: Suggestion = {
      id: uuidv4(),
      author: user.id,
      authorName: user.username || user.firstName || "Anonymous",
      authorImg: user.imageUrl || "https://flycatcher.app/board-pages/default-pfp.png",
      title,
      description,
      votes: [],
      status: "new",
      comments: [],
      createdAt: new Date(),
      updatedAt: undefined,
    }

    const updatedSuggestions: Suggestion[] = [...matchingBoard.suggestions, newSuggestion]

    // sort suggestions by votes
    updatedSuggestions.sort((a: Suggestion, b: Suggestion) => b.votes.length - a.votes.length)

    await collection.updateOne({ urlName: board.urlName }, { $set: { suggestions: updatedSuggestions } })

    return NextResponse.json({ message: "Suggestion added successfully", suggestion: newSuggestion }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error creating board:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
