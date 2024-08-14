import SettingWrapper from "../customize/SettingWrapper"
import EditTextForm from "./EditTextForm"
import { useTemplateStore } from "@/stores/TemplateStore"

export default function SettingsPanel() {
  const { template } = useTemplateStore()

  return (
    <div className="w-full flex flex-col space-y-6">
      <SettingWrapper title="Campaign Editor" subtitle="Create and edit the email that will be sent as your next campaign">
        <div className="flex flex-col space-y-4">
          <EditTextForm label="Template Name" textKey="name" content={template.name} />
          <EditTextForm label="Email Subject Line" textKey="subject" content={template.subject} />
        </div>
      </SettingWrapper>
    </div>
  )
}
