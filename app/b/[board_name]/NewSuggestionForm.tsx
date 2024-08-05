import { useState } from "react"
import tinycolor from "tinycolor2"
import Image from "next/image"
import { UploadButton } from "@/utils/uploadthing"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import { Tag, Board, Suggestion } from "@/types/SuggestionBoard"
import { Project } from "@/types/Project"

export default function NewSuggestionForm({
  project,
  board,
  user,
  setBoard,
  setSignInModalIsOpen,
}: {
  project: Project | null
  board: Board | null
  user: any
  setBoard: (board: Board) => void
  setSignInModalIsOpen: (isOpen: boolean) => void
}) {
  const [suggestionTitle, setsuggestionTitle] = useState("")
  const [suggestionDescription, setsuggestionDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showUploadDropzone, setShowUploadDropzone] = useState(false)
  const [suggestionImageUrl, setSuggestionImageUrl] = useState("")
  const [imageSubmitting, setImageSubmitting] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const lighterSecondaryColor = project?.settings.secondaryColor
    ? tinycolor(project?.settings.secondaryColor).lighten(20).toString()
    : "#f9fafb" // #f9fafb is tailwind gray-50

  const handleNewSuggestionSubmission = async () => {
    const trimmedTitle = suggestionTitle.trim()
    const trimmedDescription = suggestionDescription.trim()

    if (!trimmedTitle || !trimmedDescription) return

    if (!user?.id) {
      setSignInModalIsOpen(true)
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
        if (board) {
          const updatedBoard: Board = {
            ...board,
            suggestions: [data.suggestion, ...board.suggestions],
          }
          setBoard(updatedBoard)
        }
        toast.success("Feedback posted.")
      }

      setsuggestionTitle("")
      setsuggestionDescription("")
    } catch (error: any) {
      if (error.message === "MAX_SUGGESTIONS_REACHED") {
        toast.error("This board has reached its feedback limit.")
      } else {
        toast.error("Failed to post feedback.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: project?.settings.secondaryColor || "#f9fafb" }}>
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
                  selectedPriority === index ? project?.settings.accentColor || "#6366f1" : lighterSecondaryColor || "#fff",
                color:
                  selectedPriority === index ? project?.settings.secondaryColor || "#fff" : project?.settings.textColor || "#000",
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
                  ? project?.settings.accentColor || "#6366f1"
                  : lighterSecondaryColor || "#fff",
                color: selectedTags.includes(tag)
                  ? project?.settings.secondaryColor || "#fff"
                  : project?.settings.textColor || "#000",
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
            style={{ color: project?.settings.accentColor || "#000" }}
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
            backgroundColor: project?.settings.accentColor,
            color: project?.settings.secondaryColor,
            padding: "0.5rem 1rem",
          },
          allowedContent: {
            color: project?.settings.textColor,
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
            style={{ backgroundColor: project?.settings.secondaryColor || "#f9fafb" }}
          >
            <XMarkIcon className="h-5 w-5" style={{ color: project?.settings.accentColor || "#6366f1" }} />
          </button>
        </div>
      ) : (
        <></>
      )}
      <button
        onClick={handleNewSuggestionSubmission}
        className="w-full p-2 rounded-lg"
        style={{
          backgroundColor: project?.settings.accentColor || "#6366f1",
          color: project?.settings.secondaryColor || "#fff",
        }}
        disabled={submitting}
      >
        {submitting ? (imageSubmitting ? "Uploading..." : "Submitting...") : "Submit"}
      </button>
    </div>
  )
}
