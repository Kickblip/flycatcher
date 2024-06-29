"use client"

import LoadingWheel from "@/components/dashboard/LoadingWheel"
import { useEffect, useState } from "react"
import tinycolor from "tinycolor2"
import SuggestionCard from "@/components/board/SuggestionCard"
import { Suggestion, Board, LocalStorageUser, Vote } from "@/types/SuggestionBoard"
import PoweredByBadge from "@/components/board/PoweredByBadge"
import { v4 as uuidv4 } from "uuid"
import { useUser, SignedIn, UserButton } from "@clerk/nextjs"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { SignInToastMessage } from "@/components/board/SignInToastMessage"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<Board | null>(null) // TODO: Define types
  const [suggestionTitle, setsuggestionTitle] = useState("")
  const [suggestionDescription, setsuggestionDescription] = useState("")
  const lighterSecondaryColor = board?.secondaryColor ? tinycolor(board.secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(2)
  const [hideLoadMoreButton, setHideLoadMoreButton] = useState(false)
  const [hideEmptyMessage, setHideEmptyMessage] = useState(true)
  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    if (board) {
      // set tab title
      document.title = `Feedback | ${board.name}`
      // set favicon
      const favicon = (document.querySelector("link[rel='icon']") as HTMLLinkElement) || document.createElement("link")
      favicon.type = "image/x-icon"
      favicon.rel = "icon"
      favicon.href = board.favicon
      document.head.appendChild(favicon)
    }
  }, [board])

  useEffect(() => {
    fetchBoardData()
  }, [params.board_name])

  useEffect(() => {
    setLocalStorage()
  }, [board, isLoaded, isSignedIn, user])

  const fetchBoardData = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/pub/boards/${params.board_name}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        setLoading(false)
        throw new Error(errorData.message || "Board does not exist")
      }

      const data = await response.json()

      if (data.suggestions.length === 0) setHideEmptyMessage(false)
      if (data.suggestions.length < 10) setHideLoadMoreButton(true)

      setBoard(data)
      setLoading(false)
    } catch (error) {
      setError((error as Error).message || "Board does not exist")
      setLoading(false)
    }
  }

  const setLocalStorage = () => {
    const existingUser: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
    let userLikes: string[] = []

    if (isSignedIn && isLoaded && user && board) {
      userLikes = board.suggestions
        .filter((suggestion: Suggestion) => suggestion.votes.some((vote: Vote) => vote.author === user.id))
        .map((suggestion: Suggestion) => suggestion.id)
      if (existingUser.id) {
        // if they already have an entry in local storage
        const updatedLikes = [...existingUser.likedSuggestions, ...userLikes]
        const updatedUser: LocalStorageUser = {
          id: existingUser.id,
          likedSuggestions: updatedLikes.filter((item, index) => updatedLikes.indexOf(item) === index),
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } else {
        // if they don't have an entry in local storage
        const newUser: LocalStorageUser = {
          id: uuidv4(),
          likedSuggestions: userLikes,
        }
        localStorage.setItem("user", JSON.stringify(newUser))
      }
    } else if (!isSignedIn && isLoaded && board) {
      if (existingUser.id) {
        // not logged in and not first visit or logged in user that logged out
        return // no action needs to be taken
      } else {
        // not logged in and first visit
        const newUser: LocalStorageUser = {
          id: uuidv4(),
          likedSuggestions: [],
        }
        localStorage.setItem("user", JSON.stringify(newUser))
      }
    }
  }

  if (loading) {
    return <LoadingWheel />
  }

  if (error) {
    return <div className="text-red-500">{JSON.stringify(board)}</div>
  }

  const handleNewSuggestionSubmission = async () => {
    const trimmedTitle = suggestionTitle.trim()
    const trimmedDescription = suggestionDescription.trim()

    if (!trimmedTitle || !trimmedDescription) return

    if (!isSignedIn) {
      SignInToastMessage()
      return
    }

    if (trimmedTitle.length > 250) {
      toast.error("Suggestion title must be less than 250 characters")
      return
    }

    if (trimmedDescription.length > 500) {
      toast.error("Suggestion description must be less than 500 characters")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/add-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: trimmedTitle, description: trimmedDescription, board: board }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to post feedback")
      } else {
        const data = await response.json()
        setBoard((prevBoard) => {
          if (!prevBoard) return prevBoard
          return {
            ...prevBoard,
            suggestions: [data.suggestion, ...prevBoard.suggestions],
          }
        })
        setHideEmptyMessage(true)
      }

      setsuggestionTitle("")
      setsuggestionDescription("")
      toast.success("Feedback posted.")
    } catch (error) {
      toast.error("Failed to post feedback.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLoadMoreSuggestionsSubmission = async () => {
    setSubmitting(true)

    try {
      const response = await fetch("/api/pub/boards/load-more-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urlName: board?.urlName, page }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to load more suggestions")
      } else {
        const data = await response.json()
        setPage(page + 1)
        if (data.length < 10) {
          setHideLoadMoreButton(true)
        }
        setBoard((prevBoard) => {
          if (!prevBoard) return prevBoard
          return {
            ...prevBoard,
            suggestions: [...prevBoard.suggestions, ...data],
          }
        })
      }
    } catch (error) {
      console.error("Error loading more suggestions:", error)
      toast.error("Failed to load more suggestions")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="flex md:p-4 p-0 min-h-screen w-full"
      style={{ backgroundColor: board?.primaryColor || "#fff", color: board?.textColor || "#000" }}
    >
      <div className="w-full max-w-7xl mx-auto flex md:flex-row flex-col">
        <div className="md:w-1/3 w-full p-4">
          <div>
            {board?.logo ? (
              <Image src={board.logo} alt={`${board.name} logo`} width={175} height={175} className="mb-4" />
            ) : (
              <p className="text-xl font-bold mb-4 w-full break-words">{board?.name}</p>
            )}
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: board?.secondaryColor || "#f9fafb" }}>
            <h1 className="text-lg font-semibold mb-6">Add feedback</h1>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1" htmlFor="suggestionTitle">
                Post Title
              </label>
              <input
                id="suggestionTitle"
                type="text"
                placeholder="Add magic link authentication"
                className="w-full p-2 rounded-lg focus:outline-none"
                value={suggestionTitle}
                onChange={(e) => setsuggestionTitle(e.target.value)}
                style={{ backgroundColor: lighterSecondaryColor }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1" htmlFor="suggestionDescription">
                Post Text
              </label>
              <textarea
                id="suggestionDescription"
                placeholder="I hate having to keep track of all these passwords..."
                className="w-full p-2 rounded-lg focus:outline-none"
                value={suggestionDescription}
                onChange={(e) => setsuggestionDescription(e.target.value)}
                style={{ backgroundColor: lighterSecondaryColor, height: "100px" }}
              />
            </div>
            <button
              onClick={handleNewSuggestionSubmission}
              className="w-full p-2 rounded-lg"
              style={{ backgroundColor: board?.accentColor || "#6366f1", color: board?.secondaryColor || "#fff" }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          <PoweredByBadge primaryColor={board?.primaryColor} />
        </div>
        <div className="md:w-2/3 w-full p-4">
          {hideEmptyMessage ? null : <p className="text-md font-semibold">No feedback yet</p>}
          {board?.suggestions.map((suggestion: Suggestion, index: number) => (
            <SuggestionCard key={index} suggestion={suggestion} boardData={board} />
          ))}
          <button
            onClick={handleLoadMoreSuggestionsSubmission}
            className={"w-full p-2 rounded-lg" + (hideLoadMoreButton ? " hidden" : "")}
            style={{ backgroundColor: board?.accentColor || "#6366f1", color: board?.secondaryColor || "#fff" }}
            disabled={submitting}
          >
            {submitting ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
      <div className="absolute top-6 right-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  )
}
