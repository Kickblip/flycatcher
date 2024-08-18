import { ObjectId } from "mongodb"
import { FC } from "react"

export interface Block {
  id: string
  name: string
  thumbnail: string
}

export interface LogoTextHeaderBlock extends Block {
  fields: {
    logoSource: string
    tagline: string
  }
  component: FC<LogoTextHeaderBlockCompProps>
}

export interface LogoTextHeaderBlockCompProps {
  logoSource: string
  tagline: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export interface DatedTextBlock extends Block {
  fields: {
    title: string
    body: string
  }
  component: FC<DatedTextBlockCompProps>
}

export interface DatedTextBlockCompProps {
  title: string
  body: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export interface HorizontalDividerBlock extends Block {
  fields: {}
  component: FC<HorizontalDividerBlockCompProps>
}

export interface HorizontalDividerBlockCompProps {
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export interface LargeImageBlock extends Block {
  fields: {
    imageSource: string
  }
  component: FC<LargeImageBlockCompProps>
}

export interface LargeImageBlockCompProps {
  imageSource: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export interface TextBlock extends Block {
  fields: {
    content: string
  }
  component: FC<TextBlockCompProps>
}

export interface TextBlockCompProps {
  content: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export interface ButtonBlock extends Block {
  fields: {
    text: string
    url: string
  }
  component: FC<ButtonBlockCompProps>
}

export interface ButtonBlockCompProps {
  text: string
  url: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export interface HeaderBlock extends Block {
  fields: {
    title: string
  }
  component: FC<HeaderBlockCompProps>
}

export interface HeaderBlockCompProps {
  title: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}

export type BlockUnion =
  | LogoTextHeaderBlock
  | DatedTextBlock
  | HorizontalDividerBlock
  | LargeImageBlock
  | TextBlock
  | ButtonBlock
  | HeaderBlock

export interface EmailTemplate {
  _id?: ObjectId
  id: string
  name: string
  subject: string
  colors: {
    primaryColor: string
    secondaryColor: string
    textColor: string
    accentColor: string
  }
  previewText: string
  author: string
  blocks: BlockUnion[]
  createdAt: Date
}
