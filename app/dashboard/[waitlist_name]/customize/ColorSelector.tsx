import { WaitlistPage } from "@/types/WaitlistPage"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ColorSelector({
  color,
  colorKey,
  setPageWaitlist,
  pageWaitlist,
}: {
  color: string
  colorKey: string
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
  pageWaitlist: WaitlistPage
}) {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger>
          <div className="w-12 h-12 rounded shadow" style={{ backgroundColor: color }}></div>
        </PopoverTrigger>
        <PopoverContent>
          <HexColorPicker
            color={color}
            onChange={(newColor) => {
              setPageWaitlist({
                ...pageWaitlist,
                settings: {
                  ...pageWaitlist.settings,
                  [colorKey]: newColor,
                },
              })
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center h-12 w-48 rounded border px-4 shadow">
        <p className="text-gray-500 mr-3 text-sm">HEX</p>
        <input
          type="text"
          value={color}
          onChange={(e) => {
            const newColor = e.target.value
            setPageWaitlist({
              ...pageWaitlist,
              settings: {
                ...pageWaitlist.settings,
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
