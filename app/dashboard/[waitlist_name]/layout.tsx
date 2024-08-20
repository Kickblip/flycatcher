"use client"

import LoadingWheel from "@/components/shared/LoadingWheel"
import { useWaitlistStore } from "@/stores/WaitlistStore"
import { WaitlistPage } from "@/types/WaitlistPage"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"

export default function Layout({ children, params }: { children: React.ReactNode; params: { waitlist_name: string } }) {
  const [loading, setLoading] = useState(true)
  const { waitlist } = useWaitlistStore()

  useEffect(() => {
    const fetchWaitlist = async () => {
      if (!waitlist || waitlist.urlName !== params.waitlist_name) {
        setLoading(true)
        try {
          const response = await fetch(`/api/waitlists/partial-data/${params.waitlist_name}`)
          const data: WaitlistPage = await response.json()
          useWaitlistStore.getState().update(data)
        } catch (error) {
          console.error("Failed to fetch waitlist page:", error)
        }
      }
      setLoading(false)
    }

    fetchWaitlist()
  }, [])

  if (loading) {
    return <LoadingWheel />
  }

  return (
    <div>
      <Navbar waitlist={waitlist!} />
      <div>{children}</div>
    </div>
  )
}
