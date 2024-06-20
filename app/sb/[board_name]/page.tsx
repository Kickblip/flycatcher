"use client"

import LoadingWheel from "@/components/dashboard/LoadingWheel"
import { useEffect, useState } from "react"
import Image from "next/image"
import tinycolor from "tinycolor2"
import Link from "next/link"
import SuggestionCard from "@/components/board/SuggestionCard"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import PoweredByBadge from "@/components/board/PoweredByBadge"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<Board | null>(null) // TODO: Define types
  const [suggestionTitle, setsuggestionTitle] = useState("")
  const [suggestionDescription, setsuggestionDescription] = useState("")
  const lighterSecondaryColor = board?.secondaryColor ? tinycolor(board.secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [page, setPage] = useState(2)
  const [hideLoadMoreButton, setHideLoadMoreButton] = useState(false)

  useEffect(() => {
    if (board) document.title = board.name
  }, [board])

  const fetchBoardData = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/pub/boards/${params.board_name}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Board does not exist")
        setLoading(false)
      }

      const data = await response.json()
      setBoard(data)
      setLoading(false)
    } catch (error) {
      setError((error as Error).message || "Board does not exist")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoardData()
  }, [params.board_name])

  if (loading) {
    return <LoadingWheel />
  }

  if (error) {
    return <div className="text-red-500">{JSON.stringify(board)}</div>
  }

  const handleNewSuggestionSubmission = async () => {
    if (!suggestionTitle || !suggestionDescription) {
      return
    }

    setSubmitting(true)
    setSubmissionError(null)

    try {
      const response = await fetch("/api/pub/boards/add-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: suggestionTitle, description: suggestionDescription, board: board }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add comment")
      } else {
        const data = await response.json()
        setBoard((prevBoard) => {
          if (!prevBoard) return prevBoard
          return {
            ...prevBoard,
            suggestions: [...prevBoard.suggestions, data.suggestion],
          }
        })
      }

      setsuggestionTitle("")
      setsuggestionDescription("")
    } catch (error) {
      setSubmissionError((error as Error).message || "Failed to create board")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLoadMoreSuggestionsSubmission = async () => {
    setSubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/load-more-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urlName: board?.urlName, page }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add comment")
      } else {
        const data = await response.json()
        setPage(page + 1)
        if (data.length < 10) {
          setHideLoadMoreButton(true)
        }
        setBoard((prevBoard) => {
          if (!prevBoard) return prevBoard
          return {
            ...prevBoard,
            suggestions: [...prevBoard.suggestions, ...data],
          }
        })
      }
    } catch (error) {
      console.error("Error loading more suggestions:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="flex flex-col items-center min-h-screen w-full"
      style={{ backgroundColor: board?.primaryColor || "#fff", color: board?.textColor || "#000" }}
    >
      <div className="w-full max-w-7xl mx-auto p-4 flex">
        <div className="w-1/3 p-4">
          <div>
            <p className="text-xl font-bold mb-4">{board?.name}</p>
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: board?.secondaryColor || "#f9fafb" }}>
            <h1 className="text-lg font-semibold mb-6">Add feedback</h1>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1" htmlFor="suggestionTitle">
                Post Title
              </label>
              <input
                id="suggestionTitle"
                type="text"
                placeholder="Add magic link authentication"
                className="w-full p-2 rounded-lg focus:outline-none"
                value={suggestionTitle}
                onChange={(e) => setsuggestionTitle(e.target.value)}
                style={{ backgroundColor: lighterSecondaryColor }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1" htmlFor="suggestionDescription">
                Post Text
              </label>
              <textarea
                id="suggestionDescription"
                placeholder="I hate having to keep track of all these passwords..."
                className="w-full p-2 rounded-lg focus:outline-none"
                value={suggestionDescription}
                onChange={(e) => setsuggestionDescription(e.target.value)}
                style={{ backgroundColor: lighterSecondaryColor, height: "100px" }}
              />
            </div>
            <button
              onClick={handleNewSuggestionSubmission}
              className="w-full p-2 rounded-lg"
              style={{ backgroundColor: board?.accentColor || "#6366f1", color: board?.secondaryColor || "#fff" }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          <PoweredByBadge primaryColor={board?.primaryColor} />
        </div>
        <div className="w-2/3 p-4">
          {board?.suggestions.map((suggestion: Suggestion, index: number) => (
            <SuggestionCard key={index} suggestion={suggestion} boardData={board} />
          ))}
          <button
            onClick={handleLoadMoreSuggestionsSubmission}
            className={"w-full p-2 rounded-lg" + (hideLoadMoreButton ? " hidden" : "")}
            style={{ backgroundColor: board?.accentColor || "#6366f1", color: board?.secondaryColor || "#fff" }}
            disabled={submitting}
          >
            {submitting ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </main>
  )
}
