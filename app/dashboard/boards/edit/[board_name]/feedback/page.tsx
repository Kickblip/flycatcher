"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import LoadingWheel from "@/components/dashboard/LoadingWheel"
import Navbar from "@/components/dashboard/Navbar"
import OwnerViewSuggestionCard from "@/components/dashboard/boards/OwnerViewSuggestionCard"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import { motion } from "framer-motion"

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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, suggestion: Suggestion) => {
    e.dataTransfer.setData("suggestionId", suggestion.id)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    const suggestionId = e.dataTransfer.getData("suggestionId")
    if (!board) return

    const updatedBoard = { ...board }
    const suggestion = updatedBoard.suggestions.find((s: Suggestion) => s.id === suggestionId)

    if (suggestion) {
      suggestion.status = status
      const otherSuggestions = updatedBoard.suggestions.filter((s: Suggestion) => s.id !== suggestionId)
      updatedBoard.suggestions = [...otherSuggestions, suggestion] // Push to the end of the array
      setBoard(updatedBoard)
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
      <div className="flex flex-grow gap-4 max-w-7xl w-full mx-auto">
        <KanbanColumn
          title="New"
          status="new"
          suggestions={board!.suggestions}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="Working"
          status="working"
          suggestions={board!.suggestions}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="Shipped"
          status="shipped"
          suggestions={board!.suggestions}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        />
      </div>
    </main>
  )
}

interface KanbanColumnProps {
  title: string
  status: string
  suggestions: Suggestion[]
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: string) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, suggestion: Suggestion) => void
}

const KanbanColumn = ({ title, status, suggestions, onDrop, onDragOver, onDragStart }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col w-1/3 min-w-[200px]">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex-grow bg-gray-100 p-4 rounded-lg" onDrop={(e) => onDrop(e, status)} onDragOver={onDragOver}>
        {suggestions
          .filter((suggestion: Suggestion) => suggestion.status === status)
          .map((suggestion: Suggestion, index: number) => (
            <motion.div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e as unknown as React.DragEvent<HTMLDivElement>, suggestion)}
            >
              <OwnerViewSuggestionCard suggestion={suggestion} />
            </motion.div>
          ))}
      </div>
    </div>
  )
}
