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
}

export interface HorizontalDividerBlock extends Block {
  fields: {}
  component: FC<HorizontalDividerBlockCompProps>
}

export interface HorizontalDividerBlockCompProps {}

export interface LargeImageBlock extends Block {
  fields: {
    imageSource: string
  }
  component: FC<LargeImageBlockCompProps>
}

export interface LargeImageBlockCompProps {
  imageSource: string
}

export type BlockUnion = LogoTextHeaderBlock | DatedTextBlock | HorizontalDividerBlock | LargeImageBlock
export interface EmailTemplate {
  _id?: ObjectId
  id: string
  name: string
  subject: string
  author: string
  blocks: BlockUnion[]
  createdAt: Date
}
