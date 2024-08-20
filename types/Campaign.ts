export interface Campaign {
  author: string
  id: string
  subject: string
  previewText: string
  projectUrlName: string
  recipients: number
  blocks: Block[]
  colors: {
    primaryColor: string
    secondaryColor: string
    textColor: string
    accentColor: string
  }
  createdAt: Date
}

export interface Block {
  id: string
  fields: any
}
