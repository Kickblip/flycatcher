"use client"

import { useState } from "react"
import { Board } from "@/types/SuggestionBoard"

function NewBoardPanel({ boards, setBoards }: { boards: Board[]; setBoards: (boards: Board[]) => void }) {
  const [boardName, setBoardName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!boardName) {
      setError("Board name is required")
      return
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(boardName)) {
      setError("Board name can only contain letters, numbers, and spaces")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/boards/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: boardName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create board")
      }

      const data = await response.json()
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
      setBoardName("")
      setBoards([...boards, data.board])
    } catch (error) {
      setError((error as Error).message || "Failed to create board")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col p-4 space-y-8 bg-gray-50 h-full rounded-lg">
      <h2 className="text-xl font-bold opacity-80">Create a new feedback board</h2>
      <div className="flex flex-col">
        <input
          type="text"
          id="boardName"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Board name"
          className="mt-1 p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-gray-500">Board created successfully.</p>}
      <button
        className="mt-auto p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  )
}

export default NewBoardPanel
