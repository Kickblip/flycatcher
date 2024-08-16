import { useTemplateStore } from "@/stores/TemplateStore"

export default function EditFieldForm({
  label,
  textKey,
  content,
  index,
}: {
  label: string
  textKey: string
  content: string
  index: number
}) {
  const { template } = useTemplateStore()

  return (
    <div className="w-full">
      <h1 className="text-sm font-medium break-words mb-1">{label}</h1>
      <input
        value={content}
        type="text"
        onChange={(e) => {
          const blocks = [...template.blocks]
          const block = { ...blocks[index] }
          const updatedFields = { ...block.fields }
          // @ts-ignore
          updatedFields[textKey] = e.target.value
          block.fields = updatedFields
          blocks[index] = block
          useTemplateStore.getState().update({ ...template, blocks })
        }}
        className="w-full text-sm p-2 border rounded"
      />
    </div>
  )
}
