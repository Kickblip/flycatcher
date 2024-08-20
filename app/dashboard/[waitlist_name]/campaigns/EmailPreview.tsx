import { useTemplateStore } from "@/stores/TemplateStore"
import { useWaitlistStore } from "@/stores/WaitlistStore"
import { Tailwind } from "@react-email/components"
import { useEffect } from "react"

export default function EmailPreview() {
  const { template } = useTemplateStore()
  const { waitlist } = useWaitlistStore()

  useEffect(() => {
    useTemplateStore.getState().update({
      ...template,
      colors: {
        primaryColor: waitlist?.settings.primaryColor!,
        secondaryColor: waitlist?.settings.secondaryColor!,
        textColor: waitlist?.settings.textColor!,
        accentColor: waitlist?.settings.accentColor!,
      },
    })
  }, [])

  return (
    <Tailwind>
      <div className="font-sans px-8 py-4 rounded" style={{ backgroundColor: template.colors.secondaryColor }}>
        <div className="p-4 flex flex-col items-center" style={{ backgroundColor: template.colors.primaryColor }}>
          <div>
            {template.blocks.map((block, index) => {
              const BlockComponent = block.component
              return (
                <div key={index} className="mb-6 w-full">
                  {/* @ts-ignore */}
                  <BlockComponent {...{ ...block.fields, ...template.colors }} />
                </div>
              )
            })}
          </div>
          <div className="flex flex-col items-center text-center justify-center space-y-2 my-8">
            <p className="text-sm cursor-pointer" style={{ color: template.colors.textColor }}>
              Sent by {waitlist?.name}
            </p>
            <p className="text-sm cursor-pointer underline" style={{ color: template.colors.textColor }}>
              Unsubscribe
            </p>
          </div>
        </div>
      </div>
    </Tailwind>
  )
}
