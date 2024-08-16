import SettingWrapper from "../customize/SettingWrapper"
import BlockSettingWrapper from "./BlockSettingWrapper"
import EditFieldForm from "./EditFieldForm"
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

      <div className="w-full flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Edit Blocks</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {template.blocks.map((block, index) => (
        <BlockSettingWrapper key={index} title={block.name}>
          <div className="flex flex-col space-y-4">
            {Object.entries(block.fields).map(([key, value]) => (
              <EditFieldForm
                key={key}
                index={index}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^./, (str) => str.toUpperCase())} // convert to spaced words
                textKey={key}
                content={value}
              />
            ))}
          </div>
        </BlockSettingWrapper>
      ))}
    </div>
  )
}
