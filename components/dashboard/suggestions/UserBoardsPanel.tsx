"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowPathIcon } from "@heroicons/react/24/outline"

function UserBoardsPanel() {
  const [boards, setBoards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/boards/get-user-boards", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch boards")
      }

      const data = await response.json()
      setBoards(data.boards)
    } catch (error) {
      setError((error as Error).message || "Failed to fetch boards")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  if (loading) {
    return <div className="text-black opacity-70 text-xs">Loading boards...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col p-4 space-y-8 h-full rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold opacity-90">Your Boards</h2>
        <button onClick={fetchBoards} className="flex items-center text-indigo-500 hover:text-indigo-700 transition duration-200">
          <ArrowPathIcon className="h-5 w-5 mr-1" />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link key={board._id} href={`/sb/${board.urlName}`}>
            <div className="p-4 border bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <h3 className="text-lg font-bold">{board.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UserBoardsPanel
