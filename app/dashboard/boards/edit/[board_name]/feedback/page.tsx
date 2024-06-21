"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import LoadingWheel from "@/components/dashboard/LoadingWheel"
import Navbar from "@/components/dashboard/Navbar"
import OwnerViewSuggestionCard from "@/components/dashboard/boards/OwnerViewSuggestionCard"
import { Suggestion } from "@/types/SuggestionBoard"

export default function BoardFeedback({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<any>(null) // TODO: Define types

  const fetchBoard = async () => {
    setError(null)

    try {
      const response = await fetch(`/api/boards/full-data/${params.board_name}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Board does not exist")
      }

      const data = await response.json()
      setBoard(data)
    } catch (error) {
      setError((error as Error).message || "Board does not exist")
    }
  }

  useEffect(() => {
    fetchBoard()
  }, [params.board_name])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
        <Link href="/dashboard/suggestions" className="underline">
          Go back
        </Link>
      </div>
    )
  }

  if (!board && !error) {
    return <LoadingWheel />
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col w-full max-w-7xl mx-auto p-4">
        {board?.suggestions.map((suggestion: Suggestion, index: number) => (
          <OwnerViewSuggestionCard key={index} suggestion={suggestion} boardData={board} />
        ))}
      </div>
    </main>
  )
}
