"use client"

import { useEffect, useState } from "react"
import LoadingWheel from "../../shared/LoadingWheel"

export default function UsagePanel({ isPremium }: { isPremium: boolean }) {
  const [boardCount, setBoardCount] = useState(0)
  const [totalSuggestions, setTotalSuggestions] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    setLoading(true)
    const response = await fetch(`/api/usage/get-data`, {
      method: "GET",
    })

    if (response.ok) {
      const data = await response.json()
      setBoardCount(data.boardCount)
      setTotalSuggestions(data.totalSuggestions)
      setLoading(false)
    } else {
      console.error("Error fetching usage data")
    }
  }

  if (loading) {
    return (
      <div className="w-full h-32">
        <LoadingWheel />
      </div>
    )
  }

  return (
    <div className="w-full h-32 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 mt-4 md:mt-0">
      <div className="md:w-48 w-full bg-gray-100 p-4 rounded-lg flex flex-col">
        <p className="text-sm font-semibold text-gray-500 mb-1">Boards</p>
        <p className="text-4xl font-semibold">
          {boardCount}
          <span className="text-sm font-normal text-gray-600 ml-2">{isPremium ? "/ 10" : "/ 1"}</span>
        </p>
      </div>
      <div className="md:w-48 w-full bg-gray-100 p-4 rounded-lg flex flex-col md:ml-8">
        <p className="text-sm font-semibold text-gray-500 mb-1">Suggestions</p>
        <p className="text-4xl font-semibold">
          {totalSuggestions}
          <span className="text-sm font-normal text-gray-600 ml-2">{isPremium ? "" : "/ 50"}</span>
        </p>
      </div>
    </div>
  )
}
