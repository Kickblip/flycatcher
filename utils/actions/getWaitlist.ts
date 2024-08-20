import { WaitlistPage } from "@/types/WaitlistPage"
import clientPromise from "@/utils/mongodb"

export async function getWaitlist(urlName: string) {
  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("waitlists")

    const waitlist: WaitlistPage = (await collection.findOne(
      { urlName },
      { projection: { contacts: 0, author: 0 } },
    )) as WaitlistPage

    if (!waitlist) {
      return { success: false, error: "No waitlists found" }
    }

    return { success: true, data: waitlist }
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return { success: false, error: errorMessage }
  }
}
