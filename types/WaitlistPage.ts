import { ObjectId } from "mongodb"

export interface WaitlistPage {
  _id?: ObjectId
  author: string
  name: string
  urlName: string
  createdAt: Date
}
