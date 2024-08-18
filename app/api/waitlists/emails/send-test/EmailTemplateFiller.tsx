import { TemplateBlocks } from "@/app/dashboard/[waitlist_name]/campaigns/TemplateBlocks"
import { Body, Container, Head, Html, Preview, Tailwind } from "@react-email/components"

export default function EmailTemplateFiller({
  blocks,
  previewText,
  primaryColor,
  secondaryColor,
  textColor,
  accentColor,
}: {
  blocks: any
  previewText: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}) {
  return (
    <Html lang="en">
      <Tailwind>
        <Head>
          <Preview>{previewText}</Preview>
        </Head>
        <Body className="font-sans" style={{ backgroundColor: secondaryColor }}>
          <Container className="bg-white p-8" style={{ backgroundColor: primaryColor }}>
            {/* @ts-ignore */}
            {blocks.map((block, index) => {
              /* @ts-ignore */
              const BlockComponent = TemplateBlocks[block.id].component
              return (
                <div key={index} className="mb-6 w-full">
                  {/* @ts-ignore */}
                  <BlockComponent
                    {...{
                      ...block.fields,
                      primaryColor,
                      secondaryColor,
                      textColor,
                      accentColor,
                    }}
                  />
                </div>
              )
            })}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
