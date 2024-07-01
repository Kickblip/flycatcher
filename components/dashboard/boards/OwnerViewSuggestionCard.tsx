"use client"

import { useState } from "react"
import { Suggestion, Board } from "@/types/SuggestionBoard"
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline"
import SuggestionAdditionalInfoModal from "./SuggestionAdditionalInfoModal"

function OwnerViewSuggestionCard({
  suggestion,
  board,
  setBoard,
}: {
  suggestion: Suggestion
  board: Board
  setBoard: (board: any) => void
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  return (
    <>
      <section className="w-full mb-4 p-4 rounded-lg cursor-pointer bg-white shadow" onClick={openModal}>
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-col w-full text-black break-words">
            <h2 className="text-lg font-bold">{suggestion.title}</h2>
          </div>
          <div className="flex my-2">
            <div className="flex items-center justify-center text-black mr-2">
              <span className="text-sm mr-1">{suggestion.comments.length}</span>
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="flex items-center justify-center rounded-lg text-black">
              <span className="text-sm mr-1">{suggestion.votes.length}</span>
              <HandThumbUpIcon className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-black break-words">
            {suggestion.description.length > 150 ? `${suggestion.description.substring(0, 150)}...` : suggestion.description}
          </p>
        </div>
      </section>
      <SuggestionAdditionalInfoModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        suggestion={suggestion}
        board={board}
        setBoard={setBoard}
      />
    </>
  )
}

export default OwnerViewSuggestionCard
