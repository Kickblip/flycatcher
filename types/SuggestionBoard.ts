import { ObjectId } from "mongodb"

export interface Suggestion {
  id: string
  title: string
  author: string
  authorName: string
  authorImg: string
  description: string
  priority: number
  tags: Tag[]
  imageUrls: string[]
  votes: Vote[]
  status: "working" | "todo" | "backlog" | "done" | "new" | "cancelled" | "shipped"
  comments: Comment[]
  createdAt: Date
  updatedAt: Date | null
}

export interface Board {
  _id?: ObjectId
  name: string
  urlName: string
  logo: string
  logoKey: string
  favicon: string
  faviconKey: string
  metadataTabTitle: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  author: string
  tags: Tag[]
  authorIsPremium: boolean
  suggestions: Suggestion[]
  settings: BoardSettings
  createdAt: Date
}

export interface Tag {
  label: string
  primaryColor: string
  secondaryColor: string
}

export interface BoardSettings {
  forceSignIn: boolean
  disableBranding: boolean
  disableAnonVoting: boolean
}

export interface Comment {
  id: string
  author: string
  authorName: string
  authorImg: string
  isOwnerMessage: boolean
  content: string
  createdAt: Date
  replies: Reply[]
}

export interface Reply {
  id: string
  author: string
  authorName: string
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
