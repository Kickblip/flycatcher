"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion, AnimatePresence } from "framer-motion"
import { Board, Suggestion } from "@/types/SuggestionBoard"
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline"
import { FaLocationArrow } from "react-icons/fa6"
import CommentCard from "./CommentCard"
import TextBlock from "./TextBlock"
import { User } from "@supabase/supabase-js"

type SlideOutMenuProps = {
  board: Board
  suggestion: Suggestion
  isOpen: boolean
  onClose: () => void
  setBoard: (board: any) => void
  user: User | null
  setSignInModalIsOpen: (isOpen: boolean) => void
}

export default function SlideOutMenu({
  board,
  suggestion,
  isOpen,
  onClose,
  setBoard,
  user,
  setSignInModalIsOpen,
}: SlideOutMenuProps) {
  const [comment, setComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  const newCommentSubmit = async () => {
    if (!comment.trim()) return

    if (comment.length > 350) {
      toast.error("Comment must be less than 350 characters")
      return
    }

    if (!user?.id) {
      setSignInModalIsOpen(true)
      return
    }

    setSubmittingComment(true)

    try {
      const response = await fetch("/api/pub/boards/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, suggestionId: suggestion.id, board }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add comment")
      } else {
        const data = await response.json()
        suggestion.comments.push(data.newComment)
        toast.success("Comment added.")
      }

      setComment("")
    } catch (error) {
      console.error((error as Error).message || "Failed to add comment")
      toast.error("Failed to add comment.")
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="fixed top-0 right-0 bottom-0 w-[98%] md:w-[45%] bg-white shadow-xl z-50 overflow-y-auto"
        >
          <button onClick={onClose} className="p-4">
            <ChevronDoubleRightIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="px-16 pb-16 pt-4">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold break-words">{suggestion.title}</h2>
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

            <div className="border-t my-8"></div>

            <div className="mt-4">
              <p className="mt-2 break-words">{suggestion.description}</p>
              {suggestion.imageUrls[0] ? (
                <Image
                  src={suggestion.imageUrls[0]}
                  alt="Image attachment"
                  width={500}
                  height={500}
                  className="object-contain w-full max-h-96"
                />
              ) : (
                <></>
              )}
            </div>

            <div className="border-t my-8"></div>

            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <div className="relative w-full mb-4">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-4 py-2 pr-10"
                placeholder="Add a comment..."
              />
              <button
                onClick={newCommentSubmit}
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-indigo-500 text-white rounded-r"
              >
                <FaLocationArrow className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-4 w-full">
              {suggestion.comments.map((comment, index) => (
                <CommentCard
                  key={index}
                  comment={comment}
                  suggestion={suggestion}
                  board={board}
                  setBoard={setBoard}
                  user={user}
                  setSignInModalIsOpen={setSignInModalIsOpen}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
