"use client"

import LoadingWheel from "@/components/shared/LoadingWheel"
import { WaitlistPage } from "@/types/WaitlistPage"
import { useEffect, useState } from "react"

export default function Waitlist({ params }: { params: { waitlist_name: string } }) {
  const [waitlist, setWaitlist] = useState<WaitlistPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    fetchBoardData()
  })

  const fetchBoardData = async () => {
    try {
      const response = await fetch(`/api/pub/waitlist/${params.waitlist_name}/get-waitlist`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Waitlist does not exist")
      }

      const data = await response.json()

      setWaitlist(data)
      setLoading(false)
    } catch (error) {
      setLoadingError((error as Error).message || "Board does not exist")
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingWheel />
  }

  if (loadingError) {
    return <div>{loadingError}</div>
  }

  return <>{JSON.stringify(waitlist)}</>
}
