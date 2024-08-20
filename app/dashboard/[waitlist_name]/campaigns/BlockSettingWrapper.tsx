import { useTemplateStore } from "@/stores/TemplateStore"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BlockSettingWrapper({
  children,
  title,
  index,
}: {
  children: React.ReactNode
  title: string
  index: number
}) {
  const { template } = useTemplateStore()

  const moveBlockUp = () => {
    if (index === 0) return
    const newBlocks = [...template.blocks]
    ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
    useTemplateStore.getState().update({ ...template, blocks: newBlocks })
  }

  const moveBlockDown = () => {
    if (index === template.blocks.length - 1) return
    const newBlocks = [...template.blocks]
    ;[newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]]
    useTemplateStore.getState().update({ ...template, blocks: newBlocks })
  }

  const removeBlock = () => {
    const newBlocks = template.blocks.filter((_, i) => i !== index)
    useTemplateStore.getState().update({ ...template, blocks: newBlocks })
  }

  return (
    <div className="w-full rounded border p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-md font-medium break-words mb-1">{title}</h1>
        <div className="flex space-x-2">
          <button onClick={moveBlockUp} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 transition duration-200 rounded">
            ↑
          </button>
          <button onClick={moveBlockDown} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 transition duration-200 rounded">
            ↓
          </button>
          <AlertDialog>
            <AlertDialogTrigger>
              <button className="w-6 h-6 bg-redorange-500 hover:bg-redorange-300 transition duration-200 text-white rounded">
                ✕
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this block?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will remove this block and its content from your email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={removeBlock}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
