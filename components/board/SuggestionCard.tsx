"use client"

import { useState, useEffect } from "react"
import { Suggestion, Board, LocalStorageUser } from "@/types/SuggestionBoard"
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline"
import tinycolor from "tinycolor2"
import Modal from "react-modal"
import { useUser } from "@clerk/nextjs"

function SuggestionCard({ suggestion, boardData }: { suggestion: Suggestion; boardData: Board }) {
  const { primaryColor, secondaryColor, accentColor, textColor } = boardData
  const lighterSecondaryColor = secondaryColor ? tinycolor(secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const { isLoaded, isSignedIn, user } = useUser()
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // check if user has already liked the suggestion
    if (!isSignedIn) {
      const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (anonUserData.likedSuggestions.includes(suggestion.id)) {
        setIsLiked(true)
      }
    } else if (isSignedIn) {
      if (suggestion.votes.some((vote) => vote.author === user?.id)) {
        setIsLiked(true)
      }
    }
  }, [suggestion])

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
      backgroundColor: secondaryColor,
      color: textColor,
      padding: "20px",
      borderRadius: "15px",
      border: "0px",
      width: "45%",
      maxHeight: "90vh",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
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

    // set author id depending on if user is signed in or not
    const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
    let author = isSignedIn ? user?.id : anonUserData?.id

    try {
      const response = await fetch("/api/pub/boards/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment, suggestionId: suggestion.id, board: boardData, author: author }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add comment")
      } else {
        const data = await response.json()
        suggestion.comments.push(data.newComment)
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

    setSubmitting(true)

    // set author id depending on if user is signed in or not
    const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
    let author = isSignedIn ? user?.id : anonUserData?.id

    if (isLiked) {
      let temp = suggestion.votes.pop()
      setIsLiked(false)
      // prechange local state
      if (!isSignedIn) {
        const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
        const index = anonUserData.likedSuggestions.indexOf(suggestion.id)
        if (index > -1) {
          anonUserData.likedSuggestions.splice(index, 1)
        }
        localStorage.setItem("user", JSON.stringify(anonUserData))
      }

      try {
        const response = await fetch("/api/pub/boards/remove-vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ suggestionId: suggestion.id, board: boardData, author: author }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to remove vote")
        } else {
          const data = await response.json()
        }
      } catch (error) {
        setError((error as Error).message || "Failed to remove vote")
        console.error("Error removing vote:", error)

        // revert changes
        if (temp) suggestion.votes.push(temp)
        setIsLiked(true)
        if (!isSignedIn) {
          const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
          anonUserData.likedSuggestions.push(suggestion.id)
          localStorage.setItem("user", JSON.stringify(anonUserData))
        }
      } finally {
        setSubmitting(false)
      }
    } else {
      // prechange local state
      suggestion.votes.push({ author: "", createdAt: new Date() }) // local state doesnt need a real vote object - just something to keep count accurate
      setIsLiked(true)
      if (!isSignedIn) {
        const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
        anonUserData.likedSuggestions.push(suggestion.id)
        localStorage.setItem("user", JSON.stringify(anonUserData))
      }

      try {
        const response = await fetch("/api/pub/boards/add-vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ suggestionId: suggestion.id, board: boardData, author: author }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to add vote")
        }
      } catch (error) {
        setError((error as Error).message || "Failed to add vote")
        console.error("Error adding vote:", error)

        // revert changes
        suggestion.votes.pop()
        setIsLiked(false)
        if (!isSignedIn) {
          const anonUserData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
          const index = anonUserData.likedSuggestions.indexOf(suggestion.id)
          if (index > -1) {
            anonUserData.likedSuggestions.splice(index, 1)
          }
          localStorage.setItem("user", JSON.stringify(anonUserData))
        }
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <>
      <section
        className="w-full mb-4 p-4 rounded-lg cursor-pointer"
        style={{ backgroundColor: secondaryColor }}
        onClick={openModal}
      >
        <div className="flex justify-between w-full">
          <div className="flex flex-col break-words max-w-[80%]" style={{ color: textColor }}>
            <h2 className="text-lg font-bold mb-2">{suggestion.title}</h2>
            <p className="text-sm">{suggestion.description}</p>
          </div>
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-12 h-20" style={{ color: textColor }}>
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-sm">{suggestion.comments.length}</span>
            </div>
            <button
              className={`flex flex-col items-center justify-center w-12 h-20 rounded-lg ${
                isLiked ? "bg-accent text-secondary" : "border"
              }`}
              style={{
                backgroundColor: isLiked ? accentColor : "transparent",
                color: isLiked ? secondaryColor : accentColor,
                borderColor: !isLiked ? accentColor : "transparent",
                borderWidth: !isLiked ? "1px" : "0px",
                borderStyle: !isLiked ? "solid" : "none",
              }}
              onClick={handleVoteClick}
              disabled={submitting}
            >
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <HandThumbUpIcon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-sm">{suggestion.votes.length}</span>
            </button>
          </div>
        </div>
      </section>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles} contentLabel="Suggestion Comments Modal">
        <div className="p-4 w-full">
          <div className="mb-4 w-full break-words">
            <h2 className="text-2xl font-bold mb-4">{suggestion.title}</h2>
            <p className="text-lg">{suggestion.description}</p>
          </div>
          <div className="mb-12 mt-6">
            <h3 className="text-xl font-bold">Comments</h3>
            {suggestion.comments.length > 0 ? (
              suggestion.comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 rounded-lg" style={{ backgroundColor: lighterSecondaryColor }}>
                  <p className="text-sm" style={{ color: textColor }}>
                    {comment.content}
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
              className="w-full p-2 rounded-lg outline-none"
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              style={{ backgroundColor: lighterSecondaryColor, color: textColor }}
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
