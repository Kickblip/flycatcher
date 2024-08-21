"use client"

import LoadingWheel from "@/components/shared/LoadingWheel"
import { useWaitlistStore } from "@/stores/WaitlistStore"
import { useEffect, useState } from "react"
import PageViewsChart from "./PageViewsChart"
import { DeviceTypePieChart } from "./DeviceTypePieChart"
import StatCard from "./StatCard"
import { FaChartSimple, FaUserLarge } from "react-icons/fa6"

export default function Analytics() {
  const { waitlist } = useWaitlistStore()
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])
  const [devicePageViewsData, setDevicePageViewsData] = useState([])
  const [deivcePageSignupsData, setDevicePageSignupsData] = useState([])
  const [conversionRate, setConversionRate] = useState("0")
  const [numContacts, setNumContacts] = useState(0)

  useEffect(() => {
    if (!waitlist) return

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
        const { chartData, deviceData, numContacts } = data

        const colors = {
          desktop: "#FF3300",
          mobile: "#00CCFF",
          unknown: "#e11d48",
        }

        // split into pie chart data
        const devicePageViews = deviceData.map((item: { deviceType: string; pageViews: number }) => ({
          deviceType: item.deviceType,
          stat: item.pageViews,
          fill: colors[item.deviceType as keyof typeof colors],
        }))

        const devicePageSignups = deviceData.map((item: { deviceType: string; pageSignups: number }) => ({
          deviceType: item.deviceType,
          stat: item.pageSignups,
          fill: colors[item.deviceType as keyof typeof colors],
        }))

        setChartData(chartData)
        setDevicePageViewsData(devicePageViews)
        setDevicePageSignupsData(devicePageSignups)

        // calculate total views and signups for the week
        const totalViews = chartData.reduce((sum: number, day: { pageViews: number }) => sum + day.pageViews, 0)
        const totalSignups = chartData.reduce((sum: number, day: { pageSignups: number }) => sum + day.pageSignups, 0)
        // calculate conversion rate
        const conversionRate = totalViews > 0 ? (totalSignups / totalViews) * 100 : 0

        setConversionRate(conversionRate.toFixed(2))
        setNumContacts(numContacts)
      } catch (error) {
        console.error("Failed to fetch waitlist analytics:", error)
      }
      setLoading(false)
    }

    fetchWeekData()
  }, [waitlist])

  if (!waitlist) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  if (loading) {
    return <LoadingWheel />
  }

  return (
    <div className="flex flex-col mx-auto max-w-7xl min-h-screen space-y-4 p-4">
      <div className="w-full flex flex-col md:flex-row items-center justify-between">
        <div className="w-full flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <StatCard title="Conversion Rate" stat={`${conversionRate}%`} StatIcon={FaChartSimple} />
          <StatCard title="Total Contacts" stat={`${numContacts}`} StatIcon={FaUserLarge} />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <DeviceTypePieChart chartData={devicePageViewsData} statName="Visitors" chartName="Visitors by device" />
          <DeviceTypePieChart chartData={deivcePageSignupsData} statName="Sign ups" chartName="Sign ups by device" />
        </div>
      </div>
      <div className="w-full">
        <PageViewsChart chartData={chartData} />
      </div>
    </div>
  )
}
