import { ObjectId } from "mongodb"

export interface WaitlistPage {
  _id?: ObjectId
  name: string
  urlName: string
  author: string
  authorIsPremium: boolean
  images: WaitlistImages
  fields: Field[]
  links: Link[]
  settings: WaitlistSettings
  createdAt: Date
}

export interface Link {
  text: string
  url: string
}

export interface WaitlistImages {
  logo: string
  logoKey: string
  favicon: string
  faviconKey: string
  preview: string
  previewKey: string
}

export interface WaitlistSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  metadataTabTitle: string
  titleText: string
  subtitleText: string
}

export interface Field {
  label: string
  required: boolean
}
