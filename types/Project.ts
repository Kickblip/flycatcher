import { ObjectId } from "mongodb"

export interface Project {
  _id?: ObjectId
  author: string
  name: string
  urlName: string
  settings: ProjectSettings
  feedbackBoardId: ObjectId
  waitlistPageId: ObjectId
  createdAt: Date
}

export interface ProjectSettings {
  disableBranding: boolean
  feedbackMetadataTabTitle: string
  logo: string
  logoKey: string
  favicon: string
  faviconKey: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
}
