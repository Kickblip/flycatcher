"use client"

import { useState } from "react"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import { HandThumbUpIcon } from "@heroicons/react/24/outline"
import tinycolor from "tinycolor2"
import Modal from "react-modal"

function SuggestionCard({ suggestion, boardData }: { suggestion: Suggestion; boardData: Board }) {
  const { primaryColor, secondaryColor, accentColor, textColor } = boardData
  const lighterSecondaryColor = secondaryColor ? tinycolor(secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: lighterSecondaryColor,
      color: textColor,
      padding: "20px",
      borderRadius: "8px",
      width: "45%",
      maxHeight: "90vh",
    },
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value)
  }

  const handleAddComment = async () => {
    if (!newComment) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/pub/boards/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment, suggestionId: suggestion.id, board: boardData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add comment")
      } else {
        suggestion.comments.push(newComment)
      }

      setNewComment("")
    } catch (error) {
      setError((error as Error).message || "Failed to create board")
    } finally {
      setSubmitting(false)
    }
  }

  const handleVoteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <>
      <section
        className="w-full mb-4 p-4 rounded-lg cursor-pointer"
        style={{ backgroundColor: secondaryColor }}
        onClick={openModal}
      >
        <div className="flex justify-between">
          <div className="flex flex-col" style={{ color: textColor }}>
            <h2 className="text-lg font-bold mb-2">{suggestion.title}</h2>
            <p className="text-sm">{suggestion.description}</p>
          </div>
          <button
            className="flex flex-col items-center justify-center w-10 h-20 rounded-lg"
            style={{ backgroundColor: accentColor, color: secondaryColor }}
            onClick={handleVoteClick}
            disabled={submitting}
          >
            <div className="flex items-center justify-center w-5 h-5 mb-1">
              <HandThumbUpIcon className="w-5 h-5" />
            </div>
            <span className="text-sm">{suggestion.votes}</span>
          </button>
        </div>
      </section>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles} contentLabel="Suggestion Comments Modal">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{suggestion.title}</h2>
            <p className="text-lg">{suggestion.description}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Comments</h3>
            {suggestion.comments.length > 0 ? (
              suggestion.comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 rounded-lg" style={{ backgroundColor: lighterSecondaryColor }}>
                  <p className="text-sm" style={{ color: textColor }}>
                    {comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: textColor }}>
                No comments yet.
              </p>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none"
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              style={{ backgroundColor: "#fff", color: textColor }}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 w-full p-2 rounded-lg"
              style={{ backgroundColor: accentColor, color: secondaryColor }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SuggestionCard
