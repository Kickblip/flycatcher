import Modal from "react-modal"
import { Board } from "@/types/SuggestionBoard"
import { TrashIcon } from "@heroicons/react/24/outline"

type SettingsModalProps = {
  isOpen: boolean
  currentBoard: Board
  onRequestClose: () => void
  onSettingsSave: (updatedBoard: Board) => void
  setDeletionConfirmationModalIsOpen: (isOpen: boolean) => void
}

const SettingsModal = ({
  isOpen,
  currentBoard,
  onRequestClose,
  onSettingsSave,
  setDeletionConfirmationModalIsOpen,
}: SettingsModalProps) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Settings Modal">
      <div className="p-4">
        <button
          className="px-4 py-2 border border-gray-400 text-gray-800 hover:text-gray-900 hover:border-gray-500 rounded-lg transition duration-200"
          onClick={() => setDeletionConfirmationModalIsOpen(true)}
        >
          <TrashIcon className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </Modal>
  )
}

export default SettingsModal
