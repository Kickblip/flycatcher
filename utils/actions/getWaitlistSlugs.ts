import clientPromise from "@/utils/mongodb"

export async function getWaitlistSlugs() {
  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")

    const waitlists = await collection.find({}, { projection: { urlName: 1 } }).toArray()

    if (!waitlists.length) {
      return { success: false, error: "No waitlists found" }
    }

    return { success: true, data: waitlists }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return { success: false, error: errorMessage }
  }
}
