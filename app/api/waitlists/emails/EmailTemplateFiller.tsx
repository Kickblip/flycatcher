import { TemplateBlocks } from "@/app/dashboard/[waitlist_name]/campaigns/TemplateBlocks"
import { Body, Column, Container, Head, Html, Preview, Row, Text, Tailwind, Section, Link } from "@react-email/components"

export default function EmailTemplateFiller({
  blocks,
  previewText,
  primaryColor,
  secondaryColor,
  textColor,
  accentColor,
  waitlistUrlName,
  waitlistName,
}: {
  blocks: any
  previewText: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
  waitlistUrlName: string
  waitlistName: string
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
            <Section className="bg-white p-8 mt-8" style={{ backgroundColor: primaryColor }}>
              <Row>
                <Column className="text-center">
                  <Text className="text-sm" style={{ color: textColor }}>
                    Sent by {waitlistName}
                  </Text>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe/${waitlistUrlName}`}
                    className="text-sm underline"
                    style={{ color: textColor }}
                  >
                    Unsubscribe
                  </Link>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
