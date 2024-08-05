"use client"

import { useState, useEffect } from "react"
import { Suggestion, Board, LocalStorageUser } from "@/types/SuggestionBoard"
import { Project } from "@/types/Project"
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@/hooks/supabase"

function SuggestionCard({
  suggestion,
  boardData,
  projectData,
  setSignInModalIsOpen,
  setSlideOutMenuOpen,
  setSlideOutMenuSuggestion,
}: {
  suggestion: Suggestion
  boardData: Board
  projectData: Project
  setSignInModalIsOpen: (isOpen: boolean) => void
  setSlideOutMenuOpen: (isOpen: boolean) => void
  setSlideOutMenuSuggestion: (suggestion: Suggestion) => void
}) {
  const { primaryColor, secondaryColor, accentColor, textColor } = projectData.settings
  const [submitting, setSubmitting] = useState(false)

  const [isLiked, setIsLiked] = useState(false)
  const [suggestionTitle, setSuggestionTitle] = useState("")
  const [suggestionDescription, setSuggestionDescription] = useState("")

  const { user, stripeData, error } = useUser()

  useEffect(() => {
    if (suggestion && suggestion.title && suggestion.description) {
      setSuggestionTitle(suggestion.title)
      setSuggestionDescription(suggestion.description)
    }
  }, [suggestion])

  const handleVoteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    if (!user?.id) {
      setSignInModalIsOpen(true)
      return
    }

    setSubmitting(true)

    // set author id depending on if user is signed in or not
    const localStorageData: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
    let author = user?.id ? user?.id : localStorageData?.id

    if (isLiked) {
      let temp = suggestion.votes.pop()
      setIsLiked(false)
      // prechange local state
      const index = localStorageData.likedSuggestions.indexOf(suggestion.id)
      if (index > -1) {
        localStorageData.likedSuggestions.splice(index, 1)
      }
      localStorage.setItem("user", JSON.stringify(localStorageData))

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
        console.error("Error removing vote:", error)
        toast.error("Failed to remove vote.")

        // revert changes
        if (temp) suggestion.votes.push(temp)
        setIsLiked(true)
        localStorageData.likedSuggestions.push(suggestion.id)
        localStorage.setItem("user", JSON.stringify(localStorageData))
      } finally {
        setSubmitting(false)
      }
    } else {
      // prechange local state
      suggestion.votes.push({ author: "" }) // local state doesnt need a real vote object - just something to keep count accurate
      setIsLiked(true)
      localStorageData.likedSuggestions.push(suggestion.id)
      localStorage.setItem("user", JSON.stringify(localStorageData))

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
        console.error("Error adding vote:", error)

        // revert changes
        toast.error("Failed to add vote.")
        suggestion.votes.pop()
        setIsLiked(false)

        const index = localStorageData.likedSuggestions.indexOf(suggestion.id)
        if (index > -1) {
          localStorageData.likedSuggestions.splice(index, 1)
        }
        localStorage.setItem("user", JSON.stringify(localStorageData))
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
        onClick={() => {
          setSlideOutMenuOpen(true)
          setSlideOutMenuSuggestion(suggestion)
        }}
      >
        <div className="flex justify-between w-full">
          <div className="flex flex-col break-words max-w-[72%] md:max-w-[80%]" style={{ color: textColor }}>
            <h2 className="text-xs font-semibold mb-2" style={{ color: accentColor }}>
              {suggestion.status === "working"
                ? "Currently in-progress..."
                : suggestion.status === "shipped"
                ? "Shipped!"
                : suggestion.status === "done"
                ? "Ready for next release"
                : suggestion.status === "todo"
                ? "Planned"
                : ""}
            </h2>
            <h2 className="text-lg font-bold mb-2">{suggestionTitle}</h2>
            <p className="text-sm">{suggestionDescription}</p>
          </div>
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-12 h-20" style={{ color: textColor }}>
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" strokeWidth={1.7} />
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
    </>
  )
}

export default SuggestionCard
