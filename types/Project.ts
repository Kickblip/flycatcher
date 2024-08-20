import { ObjectId } from "mongodb"

export interface Project {
  _id?: ObjectId
  author: string
  name: string
  urlName: string
  settings: ProjectSettings
  waitlistPageId: ObjectId
  createdAt: Date
}

export interface ProjectSettings {}
