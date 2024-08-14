import { useTemplateStore } from "@/stores/TemplateStore"

export default function EmailPreview() {
  const { template } = useTemplateStore()

  const createElementFromString = (componentString: string) => {
    try {
      const Component = new Function(`return (${componentString})`)()
      return <Component />
    } catch (error) {
      console.error("Error rendering component from string:", error)
      return <div>Error rendering preview</div>
    }
  }

  return <div className="w-full">{createElementFromString(template.content)}</div>
}
