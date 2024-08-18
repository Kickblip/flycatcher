export interface Campaign {
  author: string
  id: string
  subject: string
  previewText: string
  project: string
  recipients: number
  blocks: Block[]
  createdAt: string
}

export interface Block {
  id: string
  fields: any
}
