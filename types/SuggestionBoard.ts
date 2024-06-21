import { ObjectId } from "mongodb"

export interface Suggestion {
  id: string
  title: string
  description: string
  votes: number
  status: string
  comments: string[]
}

export interface Board {
  _id: ObjectId
  name: string
  urlName: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  author: string
  suggestions: Suggestion[]
  settings: BoardSettings
}

export interface BoardSettings {
  forceSignIn: boolean
}
