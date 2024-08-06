import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { FaLink, FaArrowUpRightFromSquare } from "react-icons/fa6"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Header({ boardName }: { boardName: string }) {
  return (
    <div className="max-w-7xl w-full px-8 py-4 flex flex-col">
      <Link href={`/dashboard/home`} className="text-indigo-500 hover:text-indigo-700 transition duration-200 mb-2">
        <div className="flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" strokeWidth={2.5} />
          <span className="text-sm font-medium">Back to Projects</span>
        </div>
      </Link>
      <div className="flex justify-between items-start">
        <div className="w-2/5">
          <h1 className="text-2xl font-bold mb-1">Feedback Board</h1>
          <p className="text-gray-500">Manage the feedback your public board is collecting</p>
        </div>
        <div className="flex items-center w-2/5 border rounded-lg justify-between text-gray-700">
          <span className="text-sm font-medium p-3 truncate">{`${process.env.NEXT_PUBLIC_SITE_URL}/b/${boardName}`}</span>
          <div className="flex items-center space-x-2 px-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-200 transition duration-200"
                    onClick={() => {
                      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/b/${boardName}`)
                      toast.success("Copied to clipboard!")
                    }}
                  >
                    <FaLink className="w-4 h-4" />
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
                      href={`${process.env.NEXT_PUBLIC_SITE_URL}/b/${boardName}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-gray-200 transition duration-200"
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
      </div>
    </div>
  )
}
