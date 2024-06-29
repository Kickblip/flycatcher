"use client"

import { useEffect, useState } from "react"

export default function UsagePanel({ isPremium }: { isPremium: boolean }) {
  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    const response = await fetch(`/api/usage`, {
      method: "GET",
    })
  }

  return <div></div>
}
