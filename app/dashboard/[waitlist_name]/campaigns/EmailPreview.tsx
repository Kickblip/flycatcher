import { useTemplateStore } from "@/stores/TemplateStore"
import { Body, Container, Tailwind } from "@react-email/components"

export default function EmailPreview() {
  const { template } = useTemplateStore()

  return (
    <div className="font-sans bg-[#f6f9fc] px-8 py-4 rounded">
      <Tailwind>
        <div className="bg-white p-4 flex flex-col items-center">
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
      </Tailwind>
    </div>
  )
}
