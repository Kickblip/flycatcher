"use client"

import React from "react"
import Image from "next/image"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion, AnimatePresence } from "framer-motion"
import { Board, Suggestion } from "@/types/SuggestionBoard"
import { statuses, priorities } from "./utils"
import {
  ChevronDoubleRightIcon,
  ClockIcon,
  ChartBarSquareIcon,
  InformationCircleIcon,
  ListBulletIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"

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

type SlideOutMenuProps = {
  board: Board
  suggestion: Suggestion
  isOpen: boolean
  onClose: () => void
  setBoard: (board: any) => void
}

export default function SlideOutMenu({ board, suggestion, isOpen, onClose, setBoard }: SlideOutMenuProps) {
  const [loading, setLoading] = React.useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = React.useState("")

  const handleDeleteComment = (commentId: string) => {
    return async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/boards/delete-comment`, {
          method: "POST",
          body: JSON.stringify({ suggestionId: suggestion.id, commentId, boardName: board.urlName }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Board does not exist")
        }

        const deleteCommentById = (comments: any[], commentId: string): any[] => {
          return comments
            .map((comment) => {
              if (comment.id === commentId) {
                return null // remove comment
              }
              if (comment.replies) {
                comment.replies = deleteCommentById(comment.replies, commentId)
              }
              return comment
            })
            .filter(Boolean) // filter null
        }

        setBoard((prevBoard: Board) => ({
          ...prevBoard,
          suggestions: prevBoard.suggestions.map((s) => {
            if (s.id === suggestion.id) {
              return {
                ...s,
                comments: deleteCommentById(s.comments, commentId),
              }
            }
            return s
          }),
        }))

        suggestion.comments = deleteCommentById(suggestion.comments, commentId)

        toast.success("Comment deleted.")
      } catch (error) {
        console.error("Error deleting comment:", error)
        toast.error("Failed to delete comment.")
      } finally {
        setLoading(false)
      }
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

              <div>
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                {suggestion.comments.length > 0 ? (
                  suggestion.comments.map((comment, index) => (
                    <div key={index} className="w-full flex flex-col mb-1 p-2 rounded-lg">
                      <div className="flex items-center">
                        <Image
                          src={comment.authorImg || "/board-pages/default-pfp.png"}
                          alt="Author"
                          width={500}
                          height={500}
                          className="rounded-full object-cover w-6 h-6"
                        />
                        <p className="text-xs mx-2">{comment.authorName || "Anonymous"}</p>
                        <p className="text-xs break-words text-gray-700">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="text-red-500 flex items-center justify-center ml-2"
                              title="Delete this comment"
                              onClick={() => {
                                setCommentIdToDelete(comment.id)
                              }}
                              disabled={loading}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This comment will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteComment(commentIdToDelete)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <p className="text-sm break-words mt-2 mb-1">{comment.content}</p>
                      <div>
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 ml-4 border-l-2 pl-2 border-gray-700">
                            {comment.replies.map((reply, replyIndex) => (
                              <div key={replyIndex} className="mb-2">
                                <div className="flex items-center mb-1">
                                  <Image
                                    src={reply.authorImg || "/board-pages/default-pfp.png"}
                                    alt="Author"
                                    width={500}
                                    height={500}
                                    className="rounded-full object-cover w-6 h-6"
                                  />
                                  <p className="text-xs mx-2">{reply.authorName || "Anonymous"}</p>
                                  <p className="text-xs break-words text-gray-700">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </p>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button
                                        className="text-red-500 flex items-center justify-center ml-2"
                                        title="Delete this comment"
                                        onClick={() => {
                                          setCommentIdToDelete(reply.id)
                                        }}
                                        disabled={loading}
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This comment will be permanently deleted.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteComment(commentIdToDelete)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                                <p className="text-sm w-full break-words">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
