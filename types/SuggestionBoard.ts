import { ObjectId } from "mongodb"

export interface Suggestion {
  id: string
  title: string
  author: string
  description: string
  votes: Vote[]
  status: string
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Board {
  _id?: ObjectId
  name: string
  urlName: string
  logo: string
  logoKey: string
  favicon: string
  faviconKey: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  author: string
  suggestions: Suggestion[]
  settings: BoardSettings
  createdAt: Date
}

export interface BoardSettings {
  forceSignIn: boolean
  disableBranding: boolean
}

export interface Comment {
  author: string
  isOwnerMessage: boolean
  content: string
  createdAt: Date
}

export interface LocalStorageUser {
  id: string
  likedSuggestions: string[]
  suggestions: Suggestion[]
  comments: Comment[]
}

export interface Vote {
  author: string
  createdAt: Date
}
