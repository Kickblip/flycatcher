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
import { createColumns } from "./columns"
import { DataTable } from "./data-table"
import SlideOutMenu from "./SlideOutMenu"

export default function BoardFeedback({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<Board | null>(null)
  const [slideOutMenuOpen, setSlideOutMenuOpen] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)

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
    <main className="flex flex-col items-center w-full">
      <Navbar />
      <div className="flex max-w-7xl w-full mx-auto mt-10 md:mb-6 mb-2">
        <KanbanNewSuggestionsSection board={board!} setBoard={setBoard} />
      </div>
      <div className="container max-w-7xl mx-auto">
        <DataTable
          columns={createColumns(board!, (suggestion: Suggestion) => {
            if (slideOutMenuOpen) {
              setSelectedSuggestion(suggestion)
            } else {
              setSelectedSuggestion(suggestion)
              setSlideOutMenuOpen(!slideOutMenuOpen)
            }
          })}
          data={board!.suggestions}
          boardName={board!.urlName}
        />
      </div>
      <SlideOutMenu
        board={board!}
        suggestion={selectedSuggestion!}
        isOpen={slideOutMenuOpen}
        onClose={() => {
          setSlideOutMenuOpen(false)
        }}
      />
    </main>
  )
}
