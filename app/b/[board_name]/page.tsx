"use client"

import LoadingWheel from "@/components/shared/LoadingWheel"
import { useEffect, useState } from "react"
import SuggestionCard from "@/app/b/[board_name]/SuggestionCard"
import SlideOutMenu from "./SlideOutMenu"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import { Project } from "@/types/Project"
import PoweredByBadge from "@/app/b/[board_name]/PoweredByBadge"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { useUser } from "@/hooks/supabase"
import UserButton from "@/components/shared/UserButton"
import Modal from "react-modal"
import SignInForm from "@/components/shared/SignInForm"
import NewSuggestionForm from "./NewSuggestionForm"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<Board | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(2)
  const [hideLoadMoreButton, setHideLoadMoreButton] = useState(false)
  const [hideEmptyMessage, setHideEmptyMessage] = useState(true)
  const { user, stripeData, error } = useUser()
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false)
  const [slideOutMenuOpen, setSlideOutMenuOpen] = useState(false)
  const [slideOutMenuSuggestion, setSlideOutMenuSuggestion] = useState<Suggestion | null>(null)

  useEffect(() => {
    if (board) {
      // set tab title
      document.title = project?.settings.feedbackMetadataTabTitle || `Feedback | ${board.name}`
      // set favicon
      const favicon = (document.querySelector("link[rel='icon']") as HTMLLinkElement) || document.createElement("link")
      favicon.type = "image/x-icon"
      favicon.rel = "icon"
      favicon.href = project?.settings.favicon || "/favicon.ico"
      document.head.appendChild(favicon)
    }
  }, [board, project])

  useEffect(() => {
    fetchBoardData()
    fetchProjectData()
  }, [params.board_name])

  const fetchBoardData = async () => {
    try {
      const response = await fetch(`/api/pub/boards/${params.board_name}/get-board`, {
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
    } catch (error) {
      setLoadingError((error as Error).message || "Board does not exist")
      setLoading(false)
    }
  }

  const fetchProjectData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pub/boards/${params.board_name}/get-project`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        setLoading(false)
        throw new Error(errorData.message || "Project does not exist")
      }

      const data = await response.json()

      setProject(data)
      setLoading(false)
    } catch (error) {
      setLoadingError((error as Error).message || "Board does not exist")
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingWheel />
  }

  if (loadingError) {
    console.error(error)
    return <div className="text-red-500">{JSON.stringify(board)}</div>
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
      style={{ backgroundColor: project?.settings.primaryColor || "#fff", color: project?.settings.textColor || "#000" }}
    >
      <div className="w-full max-w-7xl mx-auto flex md:flex-row flex-col">
        <div className="md:w-1/3 w-full p-4">
          <div>
            {project?.settings.logo ? (
              <Image src={project.settings.logo} alt={`${board?.name} logo`} width={175} height={175} className="mb-4" />
            ) : (
              <p className="text-xl font-bold mb-4 w-full break-words">{board?.name}</p>
            )}
          </div>
          <NewSuggestionForm
            project={project!}
            board={board!}
            user={user}
            setBoard={setBoard}
            setSignInModalIsOpen={setSignInModalIsOpen}
          />
          <div className={project?.settings.disableBranding ? `hidden` : ""}>
            <PoweredByBadge primaryColor={project?.settings.primaryColor} />
          </div>
        </div>
        <div className="md:w-2/3 w-full p-4">
          {hideEmptyMessage ? null : <p className="text-md font-semibold">No feedback yet</p>}
          {board?.suggestions.map((suggestion: Suggestion, index: number) => (
            <SuggestionCard
              key={index}
              suggestion={suggestion}
              boardData={board}
              projectData={project!}
              setSignInModalIsOpen={setSignInModalIsOpen}
              setSlideOutMenuOpen={setSlideOutMenuOpen}
              setSlideOutMenuSuggestion={setSlideOutMenuSuggestion}
            />
          ))}
          <button
            onClick={handleLoadMoreSuggestionsSubmission}
            className={"w-full p-2 rounded-lg" + (hideLoadMoreButton ? " hidden" : "")}
            style={{
              backgroundColor: project?.settings.accentColor || "#6366f1",
              color: project?.settings.secondaryColor || "#fff",
            }}
            disabled={submitting}
          >
            {submitting ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
      <Modal
        isOpen={signInModalIsOpen}
        onRequestClose={() => {
          setSignInModalIsOpen(false)
        }}
        contentLabel="Sign In Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            boxShadow: "none",
          },
        }}
      >
        <SignInForm redirectUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/b/${board?.urlName}`} />
      </Modal>
      <SlideOutMenu
        board={board!}
        setBoard={setBoard}
        suggestion={slideOutMenuSuggestion!}
        isOpen={slideOutMenuOpen}
        onClose={() => setSlideOutMenuOpen(false)}
        user={user}
        setSignInModalIsOpen={setSignInModalIsOpen}
      />
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
