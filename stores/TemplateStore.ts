import { EmailTemplate } from "@/types/EmailTemplate"
import { create } from "zustand"

const defaultTemplate: EmailTemplate = {
  id: "1",
  name: "New campaign",
  subject: "Development update",
  previewText: "Check out our latest updates",
  author: "",
  blocks: [],
  colors: {
    primaryColor: "#ffffff",
    secondaryColor: "#ffffff",
    textColor: "#ffffff",
    accentColor: "#ffffff",
  },
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
