import { TemplateBlocks } from "@/app/dashboard/[waitlist_name]/campaigns/TemplateBlocks"
import { Body, Container, Head, Html, Preview, Tailwind } from "@react-email/components"

export default function EmailTemplateFiller({ blocks }: { blocks: any }) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primaryColor: "#007291",
                secondaryColor: "#007291",
                textColor: "#007291",
                accentColor: "#007291",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Testing email from Flycatcher</Preview>
        <Body className="font-sans bg-[#f6f9fc]">
          <Container className="bg-white p-8">
            {/* @ts-ignore */}
            {blocks.map((block, index) => {
              /* @ts-ignore */
              const BlockComponent = TemplateBlocks[block.id].component
              return (
                <div key={index} className="mb-6 w-full">
                  {/* @ts-ignore */}
                  <BlockComponent {...block.fields} />
                </div>
              )
            })}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
