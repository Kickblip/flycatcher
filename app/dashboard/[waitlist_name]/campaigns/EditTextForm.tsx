import { useTemplateStore } from "@/stores/TemplateStore"

export default function EditTextForm({ label, textKey, content }: { label: string; textKey: string; content: string }) {
  const { template } = useTemplateStore()
  return (
    <div className="w-full">
      <h1 className="text-sm font-medium break-words mb-1">{label}</h1>
      <input
        value={content}
        type="text"
        onChange={(e) => {
          useTemplateStore.getState().update({ ...template, [textKey]: e.target.value })
        }}
        className="w-full text-sm p-2 border rounded"
      />
    </div>
  )
}
