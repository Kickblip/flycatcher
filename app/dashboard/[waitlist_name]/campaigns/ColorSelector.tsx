import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTemplateStore } from "@/stores/TemplateStore"

export default function ColorSelector({ color, colorKey }: { color: string; colorKey: string }) {
  const { template } = useTemplateStore()
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger>
          <div className="w-12 h-12 rounded shadow" style={{ backgroundColor: color }}></div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex justify-center w-full">
            <HexColorPicker
              color={color}
              onChange={(newColor) => {
                useTemplateStore.getState().update({
                  ...template,
                  colors: {
                    ...template.colors,
                    [colorKey]: newColor,
                  },
                })
              }}
            />
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center h-12 w-48 rounded border px-4 shadow">
        <p className="text-gray-500 mr-3 text-sm">HEX</p>
        <input
          type="text"
          value={color}
          onChange={(e) => {
            const newColor = e.target.value
            useTemplateStore.getState().update({
              ...template,
              colors: {
                ...template.colors,
                [colorKey]: newColor,
              },
            })
          }}
          className="text-sm w-20 bg-transparent"
        />
      </div>
    </div>
  )
}
