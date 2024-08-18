import { ObjectId } from "mongodb"

export interface WaitlistPage {
  _id?: ObjectId
  name: string
  urlName: string
  author: string
  authorIsPremium: boolean
  images: WaitlistImages
  fields: Field[]
  uploadedContent: string[]
  settings: WaitlistSettings
  socialLinks: SocialLinks
  contacts: Contact[]
  createdAt: Date
}

export interface Contact {
  id: string
  email: string
  fields: {
    [key: string]: string
  }
  createdAt: Date
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
  submitButtonText: string
}

export interface SocialLinks {
  twitter: string
  youtube: string
  linkedin: string
  facebook: string
  instagram: string
  tiktok: string
}

export interface Field {
  label: string
  placeholder: string
  enabled: boolean
  required: boolean
}
