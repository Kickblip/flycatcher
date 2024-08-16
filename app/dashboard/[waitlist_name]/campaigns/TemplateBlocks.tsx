import { Text, Hr, Img, Section, Row, Column } from "@react-email/components"
import {
  DatedTextBlock,
  DatedTextBlockCompProps,
  HorizontalDividerBlock,
  HorizontalDividerBlockCompProps,
  LargeImageBlock,
  LargeImageBlockCompProps,
  LogoTextHeaderBlock,
  LogoTextHeaderBlockCompProps,
} from "@/types/EmailTemplate"
import { FC } from "react"
import { format } from "date-fns"

const LogoTextHeaderBlockComp: FC<LogoTextHeaderBlockCompProps> = ({ logoSource, tagline }) => (
  <Section>
    <Row>
      <Column>
        <Img src={logoSource} width="170" height="45" alt="Logo" />
      </Column>
      <Column>
        <Text className="pl-40 text-right text-[#FF3300] font-medium">{tagline}</Text>
      </Column>
    </Row>
  </Section>
)

const DatedTextBlockComp: FC<DatedTextBlockCompProps> = ({ title, body }) => (
  <Section>
    <Row>
      <Text className="opacity-80 mb-1 mt-6">{format(Date.now(), "MMMM dd")}</Text>
    </Row>
    <Row>
      <Text className="font-semibold text-3xl my-0">{title}</Text>
    </Row>
    <Row>
      <Text className="mt-3">{body}</Text>
    </Row>
  </Section>
)

const HorizontalDividerBlockComp: FC<HorizontalDividerBlockCompProps> = ({}) => (
  <Section>
    <Hr className="my-4 w-full border border-2" />
  </Section>
)

const LargeImageBlockComp: FC<LargeImageBlockCompProps> = ({ imageSource }) => (
  <Section>
    <Img src={imageSource} width="600" height="338" alt="Header Image" className="rounded-lg" />
  </Section>
)

export const TemplateBlocks: {
  logoTextHeaderBlock: LogoTextHeaderBlock
  datedTextBlock: DatedTextBlock
  horizontalDividerBlock: HorizontalDividerBlock
  largeImageBlock: LargeImageBlock
} = {
  logoTextHeaderBlock: {
    id: "logoTextHeaderBlock",
    name: "Logo and Text Header",
    thumbnail: "/email-block-thumbnails/logoTextHeaderBlock.png",
    component: LogoTextHeaderBlockComp,
    fields: {
      logoSource: "https://flycatcher.app/landing/logo.png",
      tagline: "The best way to catch up on the latest news",
    },
  },
  datedTextBlock: {
    id: "datedTextBlock",
    name: "Dated Text",
    thumbnail: "/email-block-thumbnails/datedTextBlock.png",
    component: DatedTextBlockComp,
    fields: {
      title: "Weekly Update",
      body: "We've been working hard to bring you the best experience possible. Here's what we've been up to.",
    },
  },
  horizontalDividerBlock: {
    id: "horizontalDividerBlock",
    name: "Horizontal Divider",
    thumbnail: "/email-block-thumbnails/horizontalDividerBlock.png",
    component: HorizontalDividerBlockComp,
    fields: {},
  },
  largeImageBlock: {
    id: "largeImageBlock",
    name: "Large Image",
    thumbnail: "/email-block-thumbnails/largeImageBlock.png",
    component: LargeImageBlockComp,
    fields: {
      imageSource: "https://flycatcher.app/ogimage.png",
    },
  },
}
