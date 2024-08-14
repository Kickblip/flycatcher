import { EmailTemplate } from "@/types/EmailTemplate"
import { create } from "zustand"

const defaultTemplate: EmailTemplate = {
  id: "1",
  name: "New campaign",
  subject: "Development update",
  author: "",
  content: "Hello, welcome to the waitlist!",
  createdAt: new Date(),
}

interface TemplateStore {
  template: EmailTemplate
  update: (template: EmailTemplate) => void
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  template: defaultTemplate,
  update: (template) => set(() => ({ template })),
}))
