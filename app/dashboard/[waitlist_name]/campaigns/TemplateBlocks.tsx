import { Text, Hr, Img, Section, Row, Column, Button, Heading } from "@react-email/components"
import {
  ButtonBlock,
  ButtonBlockCompProps,
  DatedTextBlock,
  DatedTextBlockCompProps,
  HeaderBlock,
  HeaderBlockCompProps,
  HorizontalDividerBlock,
  HorizontalDividerBlockCompProps,
  LargeImageBlock,
  LargeImageBlockCompProps,
  LogoTextHeaderBlock,
  LogoTextHeaderBlockCompProps,
  TextBlock,
  TextBlockCompProps,
} from "@/types/EmailTemplate"
import { FC } from "react"
import { format } from "date-fns"

const LogoTextHeaderBlockComp: FC<LogoTextHeaderBlockCompProps> = ({ logoSource, tagline }) => (
  <Section className="text-textColor">
    <Row>
      <Column>
        <Img src={logoSource} width="170" height="45" alt="Logo" />
      </Column>
      <Column>
        <Text className="pl-40 text-right text-accentColor font-medium">{tagline}</Text>
      </Column>
    </Row>
  </Section>
)

const DatedTextBlockComp: FC<DatedTextBlockCompProps> = ({ title, body }) => (
  <Section className="text-textColor">
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
  <Section className="text-textColor">
    <Hr className="my-4 w-full border border-2 border-textColor opacity-50 bg-textColor" />
  </Section>
)

const LargeImageBlockComp: FC<LargeImageBlockCompProps> = ({ imageSource }) => (
  <Section>
    <Img src={imageSource} width="600" height="338" alt="Header Image" className="rounded-lg" />
  </Section>
)

const TextBlockComp: FC<TextBlockCompProps> = ({ content }) => <Text>{content}</Text>

const ButtonBlockComp: FC<ButtonBlockCompProps> = ({ text, url }) => (
  <Button href={url} className="w-full p-3 font-semibold text-center rounded bg-accentColor text-secondaryColor">
    {text}
  </Button>
)

const HeaderBlockComp: FC<HeaderBlockCompProps> = ({ title }) => (
  <Heading as={"h2"} className="font-semibold text-3xl text-textColor">
    {title}
  </Heading>
)

export const TemplateBlocks: {
  logoTextHeaderBlock: LogoTextHeaderBlock
  datedTextBlock: DatedTextBlock
  horizontalDividerBlock: HorizontalDividerBlock
  largeImageBlock: LargeImageBlock
  textBlock: TextBlock
  buttonBlock: ButtonBlock
  headerBlock: HeaderBlock
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
  textBlock: {
    id: "textBlock",
    name: "Text",
    thumbnail: "/email-block-thumbnails/textBlock.png",
    component: TextBlockComp,
    fields: {
      content: "This is a text block",
    },
  },
  buttonBlock: {
    id: "buttonBlock",
    name: "Button",
    thumbnail: "/email-block-thumbnails/buttonBlock.png",
    component: ButtonBlockComp,
    fields: {
      text: "Learn more",
      url: "https://flycatcher.app",
    },
  },
  headerBlock: {
    id: "headerBlock",
    name: "Header",
    thumbnail: "/email-block-thumbnails/headerBlock.png",
    component: HeaderBlockComp,
    fields: {
      title: "This is a header",
    },
  },
}
