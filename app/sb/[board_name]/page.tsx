"use client"
import Suggestion from "@/components/suggestionsform/suggestionform"

import { useEffect, useState } from "react"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<any>(null) // TODO: Define types

  const fetchBoard = async () => {
    setError(null)

    try {
      const response = await fetch(`/api/pub/boards/${params.board_name}`, {
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
    return <div className="text-red-500">{JSON.stringify(board)}</div>
  }

  if (!board && !error) {
    return <div>Loading...</div>
  }

  return (
    <main>
      <section className="w-full">
        <div className="h-screen flex items-center justify-center">
          <Suggestion board={board} />
        </div>
      </section>
    </main>
  )
}
