// first setting clerk metadata - update all user boards
// downgrade from premium - update all user boards
import clientPromise from "@/utils/mongodb"

export async function updateBoardOwnerPremiumStatus(userId: string, isPremium: boolean) {
  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    const result = await collection.updateMany({ author: userId }, { $set: { authorIsPremium: isPremium } })

    return { success: true, error: null }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return { success: false, error: errorMessage }
  }
}
