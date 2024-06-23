"use client"

import { useState } from "react"
import { Board } from "@/types/SuggestionBoard"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function NewBoardPanel({ boards, setBoards }: { boards: Board[]; setBoards: (boards: Board[]) => void }) {
  const [boardName, setBoardName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!boardName) {
      toast.error("Board name is required")
      return
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(boardName)) {
      toast.error("Board name can only contain letters, numbers, and spaces")
      return
    }

    setLoading(true)

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
      setBoardName("")
      setBoards([...boards, data.board])
      toast.success("Board created.")
    } catch (error) {
      toast.error("Failed to create board. " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col p-4 space-y-8 bg-gray-50 h-full rounded-lg">
      <ToastContainer />
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
