import { utapi } from "@/utils/server/uploadthing"
import { NextResponse } from "next/server"
import clientPromise from "@/utils/mongodb"
import { Suggestion } from "@/types/SuggestionBoard"

interface File {
  id: string
  key: string
  name: string
  customId: string | null
  status: string
}

async function fetchAllFiles(): Promise<File[]> {
  let allFiles: File[] = []
  let hasMore = true
  let offset = 0

  while (hasMore) {
    const response = (await utapi.listFiles({ limit: 5000, offset })) as { files: File[]; hasMore: boolean }
    allFiles = allFiles.concat(response.files)
    hasMore = response.hasMore
    offset += response.files.length
  }

  return allFiles
}

const extractFileKey = (url: string) => {
  const parts = url.split("/")
  const filename = parts[parts.length - 1]
  return filename
}

export async function POST(request: Request) {
  console.time("totalTime")
  try {
    const secretKey = request.headers.get("x-cron-secret")
    if (secretKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const collection = client.db("Main").collection("boards")

    // get the image URLs from all board.logo, board.favicon, and board.suggestions.imageUrls
    const boards = await collection.find({}, { projection: { logo: 1, favicon: 1, "suggestions.imageUrls": 1 } }).toArray()
    const dbImageUrls = new Set<string>()

    boards.forEach((board) => {
      if (board.logo) dbImageUrls.add(board.logo)
      if (board.favicon) dbImageUrls.add(board.favicon)
      if (board.suggestions) {
        board.suggestions.forEach((suggestion: Suggestion) => {
          if (suggestion.imageUrls) {
            suggestion.imageUrls.forEach((url: string) => dbImageUrls.add(url))
          }
        })
      }
    })

    // turn the URLs in dbImageUrls to file keys
    const dbImageKeys = new Set<string>()
    dbImageUrls.forEach((url) => dbImageKeys.add(extractFileKey(url)))

    // get all files from UploadThing
    // compare the two lists and remove urls that do have overlap and exist in the database
    const allFiles = await fetchAllFiles()
    const unusedFiles = allFiles.filter((file) => !dbImageKeys.has(file.key))

    const unusedFileKeys = unusedFiles.map((file) => file.key)

    // go through the remaining file urls and delete them from UploadThing
    await utapi.deleteFiles(unusedFileKeys, { keyType: "fileKey" })

    console.log(`Succesfully deleted ${unusedFileKeys.length} files`)
    console.timeEnd("totalTime")
    return NextResponse.json({ message: `Succesfully deleted ${unusedFileKeys.length} files` }, { status: 200 })
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error cleaning unused images:", errorMessage)
    console.timeEnd("totalTime")
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
