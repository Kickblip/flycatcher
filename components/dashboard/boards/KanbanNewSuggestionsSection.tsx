"use client"

import { Board, Suggestion } from "@/types/SuggestionBoard"
import { useState, useEffect } from "react"
import {
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
  HandThumbUpIcon,
  Square3Stack3DIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import Modal from "react-modal"
import SuggestionAdditionalInfoModal from "./SuggestionAdditionalInfoModal"
import DeletionConfirmationModal from "./DeletionConfirmationModal"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const windowModalStyles = {
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

const KanbanNewSuggestionsSection = ({ board, setBoard }: { board: Board; setBoard: (board: any) => void }) => {
  const [newSuggestionWindowModalIsOpen, setNewSuggestionWindowModalIsOpen] = useState(false)
  const [archivedSuggestionsWindowModalIsOpen, setArchivedSuggestionsWindowModalIsOpen] = useState(false)
  const [suggestionAdditionalInfoModalIsOpen, setSuggestionAdditionalInfoModalIsOpen] = useState(false)
  const [deletionConfirmationModalIsOpen, setDeletionConfirmationModalIsOpen] = useState(false)
  const [newSuggestions, setNewSuggestions] = useState<Suggestion[]>([])
  const [archivedSuggestions, setArchivedSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const filteredSuggestions = board.suggestions.filter((suggestion) => suggestion.status === "new")
    setNewSuggestions(filteredSuggestions)
    const filteredArchiveSuggestions = board.suggestions.filter((suggestion) => suggestion.status === "archived")
    setArchivedSuggestions(filteredArchiveSuggestions)

    if (filteredSuggestions.length === 0) {
      setNewSuggestionWindowModalIsOpen(false)
    }
  }, [board.suggestions])

  useEffect(() => {
    if (newSuggestions.length === 0) {
      setNewSuggestionWindowModalIsOpen(false)
    }
  }, [newSuggestions])

  useEffect(() => {
    if (archivedSuggestions.length === 0) {
      setArchivedSuggestionsWindowModalIsOpen(false)
    }
  }, [archivedSuggestions])

  const openSuggestionAdditionalInfoModal = (suggestion: Suggestion) => {
    return () => {
      setSelectedSuggestion(suggestion)
      setSuggestionAdditionalInfoModalIsOpen(true)
      setNewSuggestionWindowModalIsOpen(false)
    }
  }
  const closeSuggestionAdditionalInfoModal = () => {
    setSuggestionAdditionalInfoModalIsOpen(false)
    setNewSuggestionWindowModalIsOpen(true)
  }

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

        setNewSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => suggestion.id !== suggestionId))
        setBoard((prevBoard: Board) => ({
          ...prevBoard,
          suggestions: prevBoard.suggestions.map((s) => (s.id === suggestionId ? { ...s, status } : s)),
        }))
        toast.success("Suggestion status updated.")
      } catch (error) {
        toast.error("Error updating suggestion status.")
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

        setNewSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => suggestion.id !== suggestionId))
        setArchivedSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => suggestion.id !== suggestionId))
        setBoard((prevBoard: Board) => ({
          ...prevBoard,
          suggestions: prevBoard.suggestions.filter((s) => s.id !== suggestionId),
        }))
        setDeletionConfirmationModalIsOpen(false)
        toast.success("Suggestion deleted.")
      } catch (error) {
        toast.error("Error deleting suggestion.")
      } finally {
        setLoading(false)
      }
    }
  }
  return (
    <>
      <div className="flex justify-between px-4 rounded-lg text-indigo-500 w-full">
        <div
          className={`${newSuggestions.length === 0 ? "hidden" : ""} flex items-center cursor-pointer`}
          onClick={() => setNewSuggestionWindowModalIsOpen(true)}
        >
          {`${newSuggestions.length} New ${newSuggestions.length < 2 ? "Suggestion" : "Suggestions"} to Review`}
          <BellIcon className="w-5 h-5 ml-2" strokeWidth={2} />
        </div>
        <div
          className={`${archivedSuggestions.length === 0 ? "hidden" : ""} flex items-center cursor-pointer`}
          onClick={() => setArchivedSuggestionsWindowModalIsOpen(true)}
        >
          {`${archivedSuggestions.length} Archived ${archivedSuggestions.length < 2 ? "Suggestion" : "Suggestions"}`}
          <ArchiveBoxIcon className="w-5 h-5 ml-2" strokeWidth={2} />
        </div>
      </div>
      <SuggestionAdditionalInfoModal
        isOpen={suggestionAdditionalInfoModalIsOpen}
        onRequestClose={closeSuggestionAdditionalInfoModal}
        suggestion={selectedSuggestion as Suggestion}
        board={board}
        setBoard={setBoard}
      />
      <Modal
        isOpen={newSuggestionWindowModalIsOpen}
        onRequestClose={() => setNewSuggestionWindowModalIsOpen(false)}
        style={windowModalStyles}
        contentLabel="New Suggestion Modal"
      >
        <div className="p-4">
          {newSuggestions.map((suggestion, index) => (
            <div key={index} className="w-full p-4 bg-white rounded-lg shadow mb-4">
              <div className="flex justify-between w-full">
                <div
                  className="flex flex-col max-w-[60%] text-black break-words cursor-pointer"
                  onClick={openSuggestionAdditionalInfoModal(suggestion)}
                >
                  <h2 className="text-lg font-bold">{suggestion.title}</h2>
                  <p className="mt-2 text-sm text-black break-words">
                    {suggestion.description.length > 150
                      ? `${suggestion.description.substring(0, 150)}...`
                      : suggestion.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center text-black mr-2">
                    <span className="text-sm mr-1">{suggestion.comments.length}</span>
                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center justify-center rounded-lg text-black mr-2">
                    <span className="text-sm mr-1">{suggestion.votes.length}</span>
                    <HandThumbUpIcon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <button
                    className="border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition duration-200 w-12 h-12 rounded-lg flex items-center justify-center"
                    title="Delete the suggestion"
                    onClick={() => {
                      setSelectedSuggestion(suggestion)
                      setDeletionConfirmationModalIsOpen(true)
                    }}
                    disabled={loading}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition duration-200 w-12 h-12 rounded-lg flex items-center justify-center"
                    title="Add the suggestion to your planner"
                    onClick={handleUpdateSuggestionStatus("planned", suggestion.id)}
                    disabled={loading}
                  >
                    <Square3Stack3DIcon className="w-5 h-5" />
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
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        isOpen={archivedSuggestionsWindowModalIsOpen}
        onRequestClose={() => setArchivedSuggestionsWindowModalIsOpen(false)}
        style={windowModalStyles}
        contentLabel="Archived Suggestions Modal"
      >
        <div className="p-4">
          {archivedSuggestions.map((suggestion, index) => (
            <div key={index} className="w-full p-4 bg-white rounded-lg shadow mb-4">
              <div className="flex justify-between w-full">
                <div
                  className="flex flex-col max-w-[60%] text-black break-words cursor-pointer"
                  onClick={openSuggestionAdditionalInfoModal(suggestion)}
                >
                  <h2 className="text-lg font-bold">{suggestion.title}</h2>
                  <p className="mt-2 text-sm text-black break-words">
                    {suggestion.description.length > 150
                      ? `${suggestion.description.substring(0, 150)}...`
                      : suggestion.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center text-black mr-2">
                    <span className="text-sm mr-1">{suggestion.comments.length}</span>
                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center justify-center rounded-lg text-black mr-2">
                    <span className="text-sm mr-1">{suggestion.votes.length}</span>
                    <HandThumbUpIcon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <button
                    className="border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition duration-200 w-12 h-12 rounded-lg flex items-center justify-center"
                    title="Delete the suggestion"
                    onClick={() => {
                      setSelectedSuggestion(suggestion)
                      setDeletionConfirmationModalIsOpen(true)
                    }}
                    disabled={loading}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200 w-12 h-12 rounded-lg flex items-center justify-center"
                    title="Add the suggestion to your planner"
                    onClick={handleUpdateSuggestionStatus("planned", suggestion.id)}
                    disabled={loading}
                  >
                    <Square3Stack3DIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <DeletionConfirmationModal
        isOpen={deletionConfirmationModalIsOpen}
        onRequestClose={() => setDeletionConfirmationModalIsOpen(false)}
        onConfirmDelete={selectedSuggestion ? handleDeleteSuggestion(selectedSuggestion!.id) : () => {}}
        contentMessage="Are you sure you want to delete this suggestion? This action cannot be undone."
      />
    </>
  )
}

export default KanbanNewSuggestionsSection
