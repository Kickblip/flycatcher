"use client"

import LoadingWheel from "@/components/dashboard/LoadingWheel"
import { useEffect, useState } from "react"
import tinycolor from "tinycolor2"
import Link from "next/link"
import { SuggestionCard } from "@/components/suggestions/suggestionscard"

interface Suggestion {
  title: string;
  description: string;
}

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<any>(null) // TODO: Define types
  const [suggestionTitle, setsuggestionTitle] = useState("")
  const [suggestionDescription, setsuggestionDescription] = useState("")
  const [suggestion, setSuggestion] = useState<Suggestion[]>([])

  const fetchBoard = async () => {
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
    fetchBoard()
  }, [params.board_name])

  if (loading) {
    return <LoadingWheel />
  }

  if (error) {
    return <div className="text-red-500">{JSON.stringify(board)}</div>
  }

  const lighterSecondaryColor = board?.secondaryColor ? tinycolor(board.secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50

  const handleNewSuggestionSubmission = () => {
    if (!suggestionTitle.trim() || !suggestionDescription.trim()) {
      return;
    }

    const newSuggestion = {
      title: suggestionTitle,
      description: suggestionDescription,
      column: "todo",
      votes: 0,
      comments: []
    }

    setSuggestion([...suggestion, newSuggestion])
    setsuggestionTitle('')
    setsuggestionDescription('')
  } // TODO: function that will submit the new suggestion to the database
  
  return (
    <main
      className="flex flex-col items-center min-h-screen w-full"
      style={{ backgroundColor: board?.primaryColor || "#fff", color: board?.textColor || "#000" }}
    >
      <div className="w-full max-w-7xl mx-auto p-4 flex">
        <div className="w-1/3 p-4">
          <div className="p-6 rounded-lg" style={{ backgroundColor: board?.secondaryColor || "#f9fafb" }}>
            <div>
              <p className="text-xl font-bold mb-4">{board?.name} Suggestions</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="suggestionTitle">
                Title
              </label>
              <input
                id="suggestionTitle"
                type="text"
                className="w-full p-2 rounded-lg focus:outline-none"
                value={suggestionTitle}
                onChange={(e) => setsuggestionTitle(e.target.value)}
                style={{ backgroundColor: lighterSecondaryColor }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="suggestionDescription">
                Description
              </label>
              <textarea
                id="suggestionDescription"
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
            >
              Submit
            </button>
          </div>
          <span className="text-md mt-2">
            Powered by{" "}
            <Link href="https://flycatcher.io/" className="underline">
              Flycatcher
            </Link>
          </span>
        </div>
        <div className="w-2/3 p-4">
          <SuggestionCard suggestions={suggestion} boardData={board}/>
        </div>
      </div>
    </main>
  )
}
