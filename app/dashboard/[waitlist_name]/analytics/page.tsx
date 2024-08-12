"use client"

import LoadingWheel from "@/components/shared/LoadingWheel"
import { useWaitlistStore } from "@/stores/WaitlistStore"
import { useEffect, useState } from "react"
import PageViewsChart from "./PageViewsChart"

export default function Analytics() {
  const { waitlist } = useWaitlistStore()
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])

  if (!waitlist) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  useEffect(() => {
    const fetchWeekData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/waitlists/analytics/get-week", {
          method: "POST",
          body: JSON.stringify({ urlName: waitlist.urlName }),
        })

        if (!response.ok) {
          console.error("Failed to fetch waitlist analytics:", response.statusText)
          setLoading(false)
          return
        }

        const data = await response.json()
        const { chartData } = data

        setChartData(chartData)
      } catch (error) {
        console.error("Failed to fetch waitlist analytics:", error)
      }
      setLoading(false)
    }
    fetchWeekData()
  }, [])

  if (loading) {
    return <LoadingWheel />
  }

  return (
    <div className="flex flex-col mx-auto max-w-7xl min-h-screen">
      <div className="w-full">
        <PageViewsChart chartData={chartData} />
      </div>
    </div>
  )
}
