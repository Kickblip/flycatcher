import { WaitlistPage } from "@/types/WaitlistPage"
import Link from "next/link"
import { FaClipboard, FaArrowUpRightFromSquare } from "react-icons/fa6"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useWaitlistStore } from "@/stores/WaitlistStore"

export default function ShareAndSave({
  pageWaitlist,
  setPageWaitlist,
}: {
  pageWaitlist: WaitlistPage
  setPageWaitlist: (pageWaitlist: WaitlistPage) => void
}) {
  const { waitlist } = useWaitlistStore()

  const saveSettings = async () => {
    try {
      const response = await fetch("/api/waitlists/update", {
        method: "POST",
        body: JSON.stringify({ waitlist: pageWaitlist }),
      })

      if (!response.ok) {
        throw new Error("Failed to update settings")
        return
      }

      const data = await response.json()
      const { waitlist } = data

      useWaitlistStore.getState().update(waitlist)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update settings")
    }
  }

  return (
    <div className="w-full flex items-center justify-between space-x-4">
      <div className="w-full flex items-center justify-between border rounded py-1">
        <span className="text-sm font-medium px-4 truncate">{`${process.env.NEXT_PUBLIC_SITE_URL}/b/${pageWaitlist.urlName}`}</span>
        <div className="flex items-center space-x-2 px-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="p-2 rounded hover:bg-gray-200 transition duration-200"
                  onClick={() => {
                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/w/${pageWaitlist.urlName}`)
                    toast.success("Copied to clipboard!")
                  }}
                >
                  <FaClipboard className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_SITE_URL}/w/${pageWaitlist.urlName}`}
                    target="_blank"
                    className="p-2 rounded hover:bg-gray-200 transition duration-200"
                  >
                    <FaArrowUpRightFromSquare className="w-4 h-4" />
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in new tab</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <button
        className="px-12 py-2 bg-redorange-500 text-white rounded hover:bg-redorange-300 transition duration-200"
        onClick={saveSettings}
      >
        Save
      </button>
    </div>
  )
}
