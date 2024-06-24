"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import LoadingWheel from "@/components/dashboard/LoadingWheel"
import Navbar from "@/components/dashboard/Navbar"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import KanbanColumn from "@/components/dashboard/boards/KanbanColumn"
import KanbanNewSuggestionsSection from "@/components/dashboard/boards/KanbanNewSuggestionsSection"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function BoardFeedback({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<Board | null>(null)

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

      const data: Board = await response.json()
      setBoard(data)
    } catch (error) {
      setError((error as Error).message || "Board does not exist")
    }
  }

  useEffect(() => {
    fetchBoard()
  }, [params.board_name])

  useEffect(() => {
    if (board) document.title = `${board.name} | Flycatcher`
  }, [board])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, suggestion: Suggestion) => {
    e.dataTransfer.setData("suggestionId", suggestion.id)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: string) => {
    const suggestionId = e.dataTransfer.getData("suggestionId")
    if (!board) return

    const updatedBoard = { ...board }
    const suggestion = updatedBoard.suggestions.find((s: Suggestion) => s.id === suggestionId)

    if (suggestion) {
      // do nothing if the user just moved this card to the column it was already in
      if (suggestion.status === status) {
        return
      }

      // store original status for rollback
      const originalStatus = suggestion.status

      // pre-update local state
      suggestion.status = status
      const otherSuggestions = updatedBoard.suggestions.filter((s: Suggestion) => s.id !== suggestionId)
      updatedBoard.suggestions = [...otherSuggestions, suggestion]
      setBoard(updatedBoard)

      try {
        const response = await fetch(`/api/boards/update-suggestion-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, suggestionId, boardName: board.urlName }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to save suggestion")
        }
        toast.success("Suggestion status updated.")
      } catch (error) {
        console.error(error)
        toast.error("Failed to update suggestion status.")

        // rollback if the api call fails
        suggestion.status = originalStatus
        const otherSuggestions = updatedBoard.suggestions.filter((s: Suggestion) => s.id !== suggestionId)
        updatedBoard.suggestions = [...otherSuggestions, suggestion]
        setBoard(updatedBoard)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

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
      <div className="flex max-w-7xl w-full mx-auto mt-10 mb-6">
        <KanbanNewSuggestionsSection board={board!} setBoard={setBoard} />
      </div>
      <div className="flex flex-grow gap-4 max-w-7xl w-full mx-auto">
        <KanbanColumn
          title="Planned"
          status="planned"
          suggestions={board!.suggestions}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          board={board!}
          setBoard={setBoard}
        />
        <KanbanColumn
          title="Working"
          status="working"
          suggestions={board!.suggestions}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          board={board!}
          setBoard={setBoard}
        />
        <KanbanColumn
          title="Shipped"
          status="shipped"
          suggestions={board!.suggestions}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          board={board!}
          setBoard={setBoard}
        />
      </div>
    </main>
  )
}
