import React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Board, Suggestion } from "@/types/SuggestionBoard"
import { statuses, priorities } from "./utils"
import {
  ChevronDoubleRightIcon,
  ClockIcon,
  ChartBarSquareIcon,
  InformationCircleIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline"

type SlideOutMenuProps = {
  board: Board
  suggestion: Suggestion
  isOpen: boolean
  onClose: () => void
}

export default function SlideOutMenu({ board, suggestion, isOpen, onClose }: SlideOutMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 bottom-0 w-[45%] bg-white shadow-xl z-50 overflow-y-auto"
        >
          <button onClick={onClose} className="p-4">
            <ChevronDoubleRightIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="px-16 pb-16 pt-4">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold">{suggestion.title}</h2>
            </div>
            <div className="flex items-center space-x-2 px-4">
              <Image
                src={suggestion.authorImg || "/board-pages/default-pfp.png"}
                alt="Author"
                width={500}
                height={500}
                className="rounded-full object-cover w-6 h-6"
              />
              <p className="text-sm mx-2">
                {suggestion.authorName.charAt(0).toUpperCase() + suggestion.authorName.slice(1) || "Anonymous"}
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 w-1/2">
                <div className="flex items-center space-x-1.5">
                  <ClockIcon className="h-5 w-5 text-gray-700" />
                  <p className="text-sm font-medium text-gray-700">Created</p>
                </div>
                <p className="text-sm text-gray-500">{new Date(suggestion.createdAt).toLocaleDateString()}</p>
                {suggestion.updatedAt && (
                  <>
                    <div className="flex items-center space-x-1.5">
                      <ClockIcon className="h-5 w-5 text-gray-700" />
                      <p className="text-sm font-medium text-gray-700">Last updated time</p>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(suggestion.updatedAt).toLocaleDateString()}</p>
                  </>
                )}
                <div className="flex items-center space-x-1.5">
                  <InformationCircleIcon className="h-5 w-5 text-gray-700" />
                  <p className="text-sm font-medium text-gray-700">Status</p>
                </div>
                <p className="text-sm text-gray-500">{statuses.find((s) => s.value === suggestion.status)?.label}</p>

                <div className="flex items-center space-x-1.5">
                  <ChartBarSquareIcon className="h-5 w-5 text-gray-700" />
                  <p className="text-sm font-medium text-gray-700">Priority</p>
                </div>
                <p className="text-sm text-gray-500">{priorities.find((s) => s.value === suggestion.priority)?.label}</p>

                <div className="flex items-center space-x-1.5">
                  <ListBulletIcon className="h-5 w-5 text-gray-700" />
                  <p className="text-sm font-medium text-gray-700">Tags</p>
                </div>
                <div className="flex flex-wrap space-x-2">
                  {suggestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-indigo-500 bg-indigo-100 border border-indigo-500 px-2 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t my-8"></div>

              <div className="mt-4">
                <p className="mt-2">{suggestion.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
