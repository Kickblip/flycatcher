import { useTemplateStore } from "@/stores/TemplateStore"
import { useWaitlistStore } from "@/stores/WaitlistStore"
import { Body, Container, Tailwind } from "@react-email/components"

export default function EmailPreview() {
  const { template } = useTemplateStore()
  const { waitlist } = useWaitlistStore()

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primaryColor: waitlist?.settings.primaryColor || "ffffff",
              secondaryColor: waitlist?.settings.secondaryColor || "#e5e7eb",
              textColor: waitlist?.settings.textColor || "#000000",
              accentColor: waitlist?.settings.accentColor || "#FF3300",
            },
          },
        },
      }}
    >
      <div className="font-sans bg-secondaryColor px-8 py-4 rounded">
        <div className="bg-primaryColor p-4 flex flex-col items-center">
          {template.blocks.map((block, index) => {
            const BlockComponent = block.component
            return (
              <div key={index} className="mb-6 w-full">
                {/* @ts-ignore */}
                <BlockComponent {...block.fields} />
              </div>
            )
          })}
        </div>
      </div>
    </Tailwind>
  )
}
