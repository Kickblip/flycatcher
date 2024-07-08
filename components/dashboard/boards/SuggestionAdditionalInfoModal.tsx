"use client"

import Modal from "react-modal"
import Image from "next/image"
import { Board, Suggestion } from "@/types/SuggestionBoard"
import { ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import DeletionConfirmationModal from "./DeletionConfirmationModal"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type SuggestionAdditionalInfoModalProps = {
  isOpen: boolean
  onRequestClose: () => void
  suggestion: Suggestion
  board: Board
  setBoard: (board: any) => void
}

const SuggestionAdditionalInfoModal = ({
  isOpen,
  onRequestClose,
  suggestion,
  board,
  setBoard,
}: SuggestionAdditionalInfoModalProps) => {
  const [loading, setLoading] = useState(false)
  const [deletionConfirmationModalIsOpen, setDeletionConfirmationModalIsOpen] = useState(false)
  const [commentDeletionConfirmationModalIsOpen, setCommentDeletionConfirmationModalIsOpen] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState("")
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const suggestionAdditionalInfoModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "gray-50",
      color: "black",
      padding: "20px",
      borderRadius: "15px",
      border: "0px",
      width: screenWidth <= 640 ? "95%" : screenWidth <= 768 ? "90%" : "50%",
      maxHeight: "90vh",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  }

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth))
    return () => {
      window.removeEventListener("resize", () => setScreenWidth(window.innerWidth))
    }
  }, [])

  if (!suggestion) return null

  const handleUpdateSuggestionStatus = (status: string, suggestionId: string) => {
    return async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/boards/update-suggestion-status`, {
          method: "POST",
          body: JSON.stringify({ status, suggestionId, boardName: board.urlName }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Board does not exist")
        }

        setBoard((prevBoard: Board) => ({
          ...prevBoard,
          suggestions: prevBoard.suggestions.map((s) => (s.id === suggestionId ? { ...s, status } : s)),
        }))
      } catch (error) {
        console.error("Error updating suggestion status:", error)
        toast.error("Failed to update suggestion status.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteSuggestion = (suggestionId: string) => {
    return async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/boards/delete-suggestion`, {
          method: "POST",
          body: JSON.stringify({ suggestionId, boardName: board.urlName }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Board does not exist")
        }

        setBoard((prevBoard: Board) => ({
          ...prevBoard,
          suggestions: prevBoard.suggestions.filter((s) => s.id !== suggestionId),
        }))
        setDeletionConfirmationModalIsOpen(false)
        toast.success("Suggestion deleted.")
      } catch (error) {
        console.error("Error deleting suggestion:", error)
        toast.error("Failed to delete suggestion.")
      } finally {
        setLoading(false)
      }
    }
  }

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

        setCommentDeletionConfirmationModalIsOpen(false)
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
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={suggestionAdditionalInfoModalStyles}
        contentLabel="Suggestion Comments Modal"
      >
        <div className="md:p-4 p-2 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start w-full mb-4">
            <div className="w-full md:w-[75%] flex flex-col">
              <div className="flex items-center mb-2">
                <Image
                  src={suggestion.authorImg || "/board-pages/default-pfp.png"}
                  alt="Author"
                  className="rounded-full object-cover w-6 h-6"
                  width={500}
                  height={500}
                />
                <p className="text-xs ml-2">{suggestion.authorName || "Anonymous"}</p>
              </div>
              <h2 className="text-2xl font-bold break-words">{suggestion.title}</h2>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button
                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-200 w-12 h-12 rounded-lg flex items-center justify-center"
                title="Delete the suggestion"
                onClick={() => setDeletionConfirmationModalIsOpen(true)}
                disabled={loading}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 transition duration-200 text-white w-12 h-12 rounded-lg flex items-center justify-center"
                title="Move the suggestion to the archive"
                onClick={handleUpdateSuggestionStatus("archived", suggestion.id)}
                disabled={loading}
              >
                <ArchiveBoxIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg break-words mb-4">{suggestion.description}</p>
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
          <div>
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            {suggestion.comments.length > 0 ? (
              suggestion.comments.map((comment, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col mb-1 p-2 rounded-lg"
                  // style={{ backgroundColor: lighterSecondaryColor }}
                >
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
                    <button
                      className="text-red-500 flex items-center justify-center ml-2"
                      title="Delete this comment"
                      onClick={() => {
                        setCommentDeletionConfirmationModalIsOpen(true)
                        setCommentIdToDelete(comment.id)
                      }}
                      disabled={loading}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
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
                              <button
                                className="text-red-500 flex items-center justify-center ml-2"
                                title="Delete this comment"
                                onClick={() => {
                                  setCommentDeletionConfirmationModalIsOpen(true)
                                  setCommentIdToDelete(reply.id)
                                }}
                                disabled={loading}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
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
              <p className="text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      </Modal>
      <DeletionConfirmationModal
        isOpen={deletionConfirmationModalIsOpen}
        onRequestClose={() => setDeletionConfirmationModalIsOpen(false)}
        onConfirmDelete={handleDeleteSuggestion(suggestion.id)}
        contentMessage="Are you sure you want to delete this suggestion? This action cannot be undone."
      />
      <DeletionConfirmationModal
        isOpen={commentDeletionConfirmationModalIsOpen}
        onRequestClose={() => setCommentDeletionConfirmationModalIsOpen(false)}
        onConfirmDelete={handleDeleteComment(commentIdToDelete)}
        contentMessage="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </>
  )
}

export default SuggestionAdditionalInfoModal
