import Modal from "react-modal"
import { Board, Suggestion } from "@/types/SuggestionBoard"
import { ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import DeletionConfirmationModal from "./DeletionConfirmationModal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
    width: "45%",
    maxHeight: "90vh",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
}

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
      } catch (error) {
        console.error("Error deleting suggestion:", error)
        toast.error("Failed to delete suggestion.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={suggestionAdditionalInfoModalStyles}
        contentLabel="Suggestion Comments Modal"
      >
        <div className="p-4 w-full">
          <div className="flex justify-between items-start w-full mb-4">
            <h2 className="text-2xl font-bold break-words w-[75%]">{suggestion.title}</h2>
            <div className="flex space-x-2">
              <button
                className="border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition duration-200 w-12 h-12 rounded-lg flex items-center justify-center"
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
            <p className="text-lg break-words">{suggestion.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            {suggestion.comments.length > 0 ? (
              suggestion.comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 rounded-lg bg-gray-50">
                  <p className="text-sm text-black">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-black">No comments yet.</p>
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
    </>
  )
}

export default SuggestionAdditionalInfoModal
