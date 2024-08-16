import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TemplateBlocks } from "./TemplateBlocks"
import { useTemplateStore } from "@/stores/TemplateStore"
import Image from "next/image"

export default function Toolbar() {
  const { template } = useTemplateStore()

  return (
    <div className="w-full flex space-x-6 mb-6">
      <Sheet>
        <SheetTrigger className="px-12 py-2 bg-redorange-500 text-white rounded hover:bg-redorange-300 transition duration-200">
          Add block
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Template blocks</SheetTitle>
            <SheetDescription>Add a premade block to your email template and edit the content in the editor</SheetDescription>
          </SheetHeader>

          <div className="mt-8 space-y-4 flex flex-col overflow-y-auto max-h-[85vh]">
            {Object.values(TemplateBlocks).map((block) => (
              <div
                key={block.id}
                className="relative flex flex-col items-center text-left space-y-3 cursor-pointer group"
                onClick={() => useTemplateStore.getState().update({ ...template, blocks: [...template.blocks, block] })}
              >
                <Image
                  src={block.thumbnail}
                  alt={block.name}
                  width={700}
                  height={700}
                  className="w-full shadow h-auto hover:opacity-80 transition duration-200"
                />
                <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black bg-opacity-75 px-4 py-2 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {block.name}
                </span>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <button
        className="px-12 py-2 bg-white border border-redorange-500 text-redorange-500 rounded hover:bg-redorange-500 hover:text-white transition duration-200"
        onClick={() => {}}
      >
        Send Campaign
      </button>
    </div>
  )
}
