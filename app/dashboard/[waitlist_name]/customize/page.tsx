"use client"

import { useWaitlistStore } from "@/stores/WaitlistStore"
import { useState } from "react"
import SettingsPanel from "./SettingsPanel"
import WaitlistPreview from "./WaitlistPreview"

export default function Customize({ params }: { params: { waitlist_name: string } }) {
  const { waitlist } = useWaitlistStore()
  const [pageWaitlist, setPageWaitlist] = useState(waitlist)

  if (!waitlist) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  return (
    <div className="max-w-7xl w-full flex mx-auto">
      <div className="w-1/2 p-4">
        <SettingsPanel pageWaitlist={pageWaitlist!} setPageWaitlist={setPageWaitlist} />
      </div>
      <div className="w-1/2 p-4">
        <div className="sticky top-8">
          <WaitlistPreview pageWaitlist={pageWaitlist!} setPageWaitlist={setPageWaitlist} />
        </div>
      </div>
    </div>
  )
}
