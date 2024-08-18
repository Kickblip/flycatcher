"use client"

import { useWaitlistStore } from "@/stores/WaitlistStore"
import SettingsPanel from "./SettingsPanel"
import { useTemplateStore } from "@/stores/TemplateStore"
import EmailPreview from "./EmailPreview"
import Toolbar from "./Toolbar"

export default function Campaigns() {
  const { waitlist } = useWaitlistStore()
  const { template } = useTemplateStore()

  if (!waitlist) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  return (
    <div className="max-w-7xl w-full flex mx-auto">
      <div className="w-2/5 p-4 flex flex-col items-center">
        <SettingsPanel />
      </div>
      <div className="w-3/5 p-4">
        <div className="sticky top-8">
          <Toolbar />
          <EmailPreview />
        </div>
      </div>
    </div>
  )
}
