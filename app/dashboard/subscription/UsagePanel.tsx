"use client"

import { useEffect, useState } from "react"
import LoadingWheel from "@/components/shared/LoadingWheel"
import { FaCircleExclamation } from "react-icons/fa6"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function UsagePanel({ isPremium }: { isPremium: boolean }) {
  const [monthTotalRecipients, setMonthTotalRecipients] = useState(0)
  const [waitlists, setWaitlists] = useState<{ name: string; contacts: number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    setLoading(true)
    const response = await fetch(`/api/usage/get-usage`, {
      method: "GET",
    })

    if (!response.ok) {
      console.error("Error fetching usage data")
    }

    const data = await response.json()
    setWaitlists(data.waitlistDetails)
    setMonthTotalRecipients(data.monthTotalRecipients)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="w-80 md:w-96 h-[26rem] flex flex-col items-center border rounded p-4">
        <div className="flex w-full justify-between mb-2">
          <p className="text-black font-semibold">Your Usage</p>
        </div>
        <div className="flex flex-col w-full">
          <LoadingWheel />
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 md:w-96 h-[26rem] flex flex-col items-center border rounded p-4 space-y-6">
      <div className="flex w-full justify-between">
        <p className="text-black font-semibold">Your Usage</p>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between">
          <p className="text-sm font-semibold">Waitlist name</p>
          <p className="text-sm font-semibold"># contacts</p>
        </div>
        {waitlists.map((waitlist, index) => (
          <div key={index} className="flex w-full justify-between py-2">
            <p className="font-medium text-sm">{waitlist.name}</p>
            <div className="flex items-center space-x-2">
              {waitlist.contacts > 50 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FaCircleExclamation className="w-5 h-5 text-redorange-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This waitlist is approaching the contact limit for free users</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                ""
              )}
              <p className="font-medium text-sm">
                {waitlist.contacts}
                {isPremium ? "" : <span className="text-gray-500">/50</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full justify-between">
        <p className="text-sm font-semibold">Emails sent this month</p>
        <p className="text-sm font-semibold">
          {monthTotalRecipients}
          {isPremium ? <span className="text-gray-500">/10000</span> : <span className="text-gray-500">/0</span>}
        </p>
      </div>
    </div>
  )
}
