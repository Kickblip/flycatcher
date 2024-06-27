import { ObjectId } from "mongodb"

export interface Suggestion {
  id: string
  title: string
  author: string
  authorImg: string
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
  id: string
  author: string
  authorImg: string
  isOwnerMessage: boolean
  content: string
  createdAt: Date
  replies: Reply[]
}

export interface Reply {
  author: string
  authorImg: string
  isOwnerMessage: boolean
  content: string
  createdAt: Date
}

export interface LocalStorageUser {
  id: string
  likedSuggestions: string[]
}

export interface Vote {
  author: string
}
