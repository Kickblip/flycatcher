"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import LoadingWheel from "@/components/shared/LoadingWheel"
import Navbar from "@/components/dashboard/Navbar"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { createColumns } from "./columns"
import { DataTable } from "./data-table"
import SlideOutMenu from "./SlideOutMenu"
import Header from "./Header"

export default function BoardFeedback({ params }: { params: { project_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<Board | null>(null)
  const [slideOutMenuOpen, setSlideOutMenuOpen] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)

  const fetchBoard = async () => {
    setError(null)

    try {
      const response = await fetch(`/api/boards/full-data/${params.project_name}`, {
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
  }, [params.project_name])

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
      <Header boardName={board!.urlName} />
      <div className="container max-w-7xl mx-auto">
        <DataTable
          columns={createColumns(
            board!,
            (suggestion: Suggestion) => {
              if (slideOutMenuOpen) {
                setSelectedSuggestion(suggestion)
              } else {
                setSelectedSuggestion(suggestion)
                setSlideOutMenuOpen(!slideOutMenuOpen)
              }
            },
            setBoard,
          )}
          data={board!.suggestions}
          possibleTags={board!.activeTags}
        />
      </div>
      <SlideOutMenu
        board={board!}
        setBoard={setBoard}
        suggestion={selectedSuggestion!}
        isOpen={slideOutMenuOpen}
        onClose={() => {
          setSlideOutMenuOpen(false)
        }}
      />
    </main>
  )
}
