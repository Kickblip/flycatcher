"use client"

import { useWaitlistStore } from "@/stores/WaitlistStore"
import SettingsPanel from "./SettingsPanel"
import { useTemplateStore } from "@/stores/TemplateStore"
import EmailPreview from "./EmailPreview"

export default function Campaigns() {
  const { waitlist } = useWaitlistStore()
  const { template } = useTemplateStore()

  if (!waitlist) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  return (
    <div className="max-w-7xl w-full flex mx-auto">
      <div className="w-1/2 p-4">
        <SettingsPanel />
      </div>
      <div className="w-1/2 p-4">
        <div className="sticky top-8">
          <EmailPreview />

          {/* <Email
            projectName={waitlist.name}
            primaryColor={waitlist.settings.primaryColor}
            secondaryColor={waitlist.settings.secondaryColor}
            accentColor={waitlist.settings.accentColor}
            textColor={waitlist.settings.textColor}
            logo={waitlist.images.logo}
          /> */}
        </div>
      </div>
    </div>
  )
}
