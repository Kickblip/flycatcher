import { ObjectId } from "mongodb"

export interface EmailTemplate {
  _id?: ObjectId
  id: string
  name: string
  subject: string
  author: string
  content: string
  createdAt: Date
}
