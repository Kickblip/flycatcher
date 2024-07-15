"use client"

import LoadingWheel from "@/components/dashboard/LoadingWheel"
import { useEffect, useState } from "react"
import tinycolor from "tinycolor2"
import SuggestionCard from "@/components/board/SuggestionCard"
import { Suggestion, Board, LocalStorageUser, Vote, Tag } from "@/types/SuggestionBoard"
import PoweredByBadge from "@/components/board/PoweredByBadge"
import { v4 as uuidv4 } from "uuid"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { UploadButton } from "@/utils/uploadthing"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useUser } from "@/hooks/supabase"
import UserButton from "@/components/shared/UserButton"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<Board | null>(null)
  const [suggestionTitle, setsuggestionTitle] = useState("")
  const [suggestionDescription, setsuggestionDescription] = useState("")
  const lighterSecondaryColor = board?.secondaryColor ? tinycolor(board.secondaryColor).lighten(20).toString() : "#f9fafb" // #f9fafb is tailwind gray-50
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(2)
  const [hideLoadMoreButton, setHideLoadMoreButton] = useState(false)
  const [hideEmptyMessage, setHideEmptyMessage] = useState(true)
  const [showUploadDropzone, setShowUploadDropzone] = useState(false)
  const [suggestionImageUrl, setSuggestionImageUrl] = useState("")
  const [imageSubmitting, setImageSubmitting] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const { user, stripeData, error } = useUser()

  useEffect(() => {
    if (board) {
      // set tab title
      document.title = board.metadataTabTitle || `Feedback | ${board.name}`
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
  }, [board, user?.id])

  const fetchBoardData = async () => {
    setLoadingError(null)
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
      setLoadingError((error as Error).message || "Board does not exist")
      setLoading(false)
    }
  }

  const setLocalStorage = () => {
    const existingUser: LocalStorageUser = JSON.parse(localStorage.getItem("user") || "{}")
    let userLikes: string[] = []

    if (user?.id && board) {
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
    } else if (!user?.id && board) {
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

  if (loadingError) {
    console.error(error)
    return <div className="text-red-500">{JSON.stringify(board)}</div>
  }

  const handleNewSuggestionSubmission = async () => {
    const trimmedTitle = suggestionTitle.trim()
    const trimmedDescription = suggestionDescription.trim()

    if (!trimmedTitle || !trimmedDescription) return

    if (!user?.id) {
      // openSignUp({
      //   fallbackRedirectUrl: `/b/${params.board_name}`,
      //   signInForceRedirectUrl: `/b/${params.board_name}`,
      //   signInFallbackRedirectUrl: `/b/${params.board_name}`,
      // })
      console.log("OPEN SIGN UP")
      // TODO: Open sign up modal
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
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          board: board,
          suggestionImageUrl,
          tags: selectedTags,
          priority: 3 - selectedPriority, // 3 - low, 2 - medium, 1 - high
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("MAX_SUGGESTIONS_REACHED")
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to post feedback")
        }
      } else {
        const data = await response.json()
        setSuggestionImageUrl("")
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
    } catch (error: any) {
      if (error.message === "MAX_SUGGESTIONS_REACHED") {
        toast.error("This board has reached it's feedback limit.")
      } else {
        toast.error("Failed to post feedback.")
      }
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
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1" htmlFor="suggestionDescription">
                Priority
              </label>
              <div className="flex items-center">
                {["Low", "Medium", "High"].map((button, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPriority(index)}
                    className={`flex-1 py-2 px-4 m-1 text-center rounded-lg text-xs font-semibold`}
                    style={{
                      backgroundColor:
                        selectedPriority === index ? board?.accentColor || "#6366f1" : lighterSecondaryColor || "#fff",
                      color: selectedPriority === index ? board?.secondaryColor || "#fff" : board?.textColor || "#000",
                    }}
                  >
                    {button}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1" htmlFor="suggestionDescription">
                Tags
              </label>
              <div className="flex flex-wrap items-center">
                {board?.activeTags.map((tag, index) => (
                  <div
                    key={index}
                    className="text-xs font-medium px-2 py-1 rounded-lg mr-2 my-1 cursor-pointer"
                    style={{
                      backgroundColor: selectedTags.includes(tag)
                        ? board?.accentColor || "#6366f1"
                        : lighterSecondaryColor || "#fff",
                      color: selectedTags.includes(tag) ? board?.secondaryColor || "#fff" : board?.textColor || "#000",
                    }}
                    onClick={() => {
                      setSelectedTags((prevTags) => {
                        return prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
                      })
                    }}
                  >
                    {tag.label}
                  </div>
                ))}
              </div>
              {board?.authorIsPremium ? (
                <button
                  className="text-xs mt-2"
                  style={{ color: board?.accentColor || "#000" }}
                  onClick={() => {
                    setShowUploadDropzone(!showUploadDropzone)
                  }}
                >
                  Attach an image
                </button>
              ) : (
                <></>
              )}
            </div>
            <UploadButton
              endpoint="suggestionImage"
              input={board?.urlName!}
              onUploadBegin={() => {
                setImageSubmitting(true)
                setSubmitting(true)
              }}
              onClientUploadComplete={(res) => {
                toast.success("Logo updated successfully.")
                setSuggestionImageUrl(res[0].url)
                setImageSubmitting(false)
                setSubmitting(false)
              }}
              onUploadError={(error: Error) => {
                console.error(error.message)
                toast.error("Failed to update logo.")
                setImageSubmitting(false)
                setSubmitting(false)
              }}
              className={`mb-4 ${showUploadDropzone ? "" : " hidden"}`}
              appearance={{
                button: {
                  backgroundColor: board?.accentColor,
                  color: board?.secondaryColor,
                },
                allowedContent: {
                  color: board?.textColor,
                },
              }}
            />
            {suggestionImageUrl ? (
              <div className="relative group mb-4">
                <Image
                  src={suggestionImageUrl}
                  alt="Uploaded image"
                  width={500}
                  height={500}
                  className={`w-full ${showUploadDropzone ? "" : "hidden"}`}
                />
                <button
                  onClick={() => setSuggestionImageUrl("")}
                  className="absolute top-0 right-0 m-2 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: board?.secondaryColor || "#f9fafb" }}
                >
                  <XMarkIcon className="h-5 w-5" style={{ color: board?.accentColor || "#6366f1" }} />
                </button>
              </div>
            ) : (
              <></>
            )}
            <button
              onClick={handleNewSuggestionSubmission}
              className="w-full p-2 rounded-lg"
              style={{ backgroundColor: board?.accentColor || "#6366f1", color: board?.secondaryColor || "#fff" }}
              disabled={submitting}
            >
              {submitting ? (imageSubmitting ? "Uploading..." : "Submitting...") : "Submit"}
            </button>
          </div>
          <div className={board?.settings.disableBranding ? `hidden` : ""}>
            <PoweredByBadge primaryColor={board?.primaryColor} />
          </div>
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
      {user ? (
        <div className="absolute top-6 right-6">
          <UserButton />
        </div>
      ) : (
        <></>
      )}
    </main>
  )
}
