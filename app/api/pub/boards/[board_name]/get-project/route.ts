import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Project, ProjectSettings } from "@/types/Project"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createClient } from "@/utils/supabase/server"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

export async function GET(request: Request, { params }: { params: { board_name: string } }) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("remote-addr") ?? ""

  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const urlName = params.board_name
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  try {
    const client = await clientPromise
    const collection = client.db("Main").collection("projects")

    const project = await collection.findOne({ urlName }, { projection: { author: 0 } })

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 404 },
      )
    }

    const userId = user?.id ?? null

    // sanitize the project data but keep instances where the userId is the author
    const sanitizedProject = {
      ...project,
      author: userId && project.author === userId ? project.author : undefined,
    }

    return NextResponse.json(sanitizedProject, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error getting project:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
