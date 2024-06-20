"use client"

import { useState } from "react"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, TrashIcon } from "@heroicons/react/24/outline"
import Modal from "react-modal"

function OwnerViewSuggestionCard({ suggestion, boardData }: { suggestion: Suggestion; boardData: Board }) {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [deletionConfirmationModalIsOpen, setDeletionConfirmationModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)
  const suggestionModalStyles = {
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

  const deletionConfirmationModalStyles = {
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

  const deleteSuggestion = async () => {
    console.log("Deleting suggestion")
    setDeletionConfirmationModalIsOpen(false)
  }

  return (
    <>
      <section className="w-full mb-4 p-4 rounded-lg cursor-pointer bg-gray-50" onClick={openModal}>
        <div className="flex justify-between w-full">
          <div className="flex flex-col break-words max-w-[80%] text-black">
            <h2 className="text-lg font-bold mb-2">{suggestion.title}</h2>
            <p className="text-sm">{suggestion.description}</p>
          </div>
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-12 h-20 text-black">
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-sm">{suggestion.comments.length}</span>
            </div>

            <div className="flex flex-col items-center justify-center w-12 h-20 rounded-lg text-black">
              <div className="flex items-center justify-center w-5 h-5 mb-1">
                <HandThumbUpIcon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-sm">{suggestion.votes}</span>
            </div>
            <button
              className="flex flex-col items-center justify-center w-12 h-20 border-2 border-red-500 rounded-lg text-red-500 ml-2 hover:bg-red-500 hover:text-white transition duration-200"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation()
                setDeletionConfirmationModalIsOpen(true)
              }}
            >
              <TrashIcon className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={suggestionModalStyles}
        contentLabel="Suggestion Comments Modal"
      >
        <div className="p-4 w-full">
          <div className="mb-4 w-full break-words">
            <h2 className="text-2xl font-bold mb-4">{suggestion.title}</h2>
            <p className="text-lg">{suggestion.description}</p>
          </div>
          <div className="mb-12 mt-6">
            <h3 className="text-xl font-bold">Comments</h3>
            {suggestion.comments.length > 0 ? (
              suggestion.comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 rounded-lg bg-gray-50">
                  <p className="text-sm text-black">{comment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-black">No comments yet.</p>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deletionConfirmationModalIsOpen}
        onRequestClose={() => setDeletionConfirmationModalIsOpen(false)}
        style={deletionConfirmationModalStyles}
        contentLabel="Confirmation Modal"
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this board? This action cannot be undone.</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={deleteSuggestion}
              className="bg-red-500 hover:bg-red-600 transition duration-200 text-white px-4 py-2 rounded-lg mx-2"
            >
              Delete
            </button>
            <button
              onClick={() => setDeletionConfirmationModalIsOpen(false)}
              className="text-black bg-gray-300 hover:bg-gray-400 transition duration-200 px-4 py-2 rounded-lg mx-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default OwnerViewSuggestionCard
