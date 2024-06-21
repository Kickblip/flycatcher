import Modal from "react-modal"

type DeletionConfirmationModalProps = {
  isOpen: boolean
  onRequestClose: () => void
  onConfirmDelete: () => void
}

const DeletionConfirmationModal = ({ isOpen, onRequestClose, onConfirmDelete }: DeletionConfirmationModalProps) => {
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Confirmation Modal">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this board? This action cannot be undone.</p>
        <div className="flex justify-center mt-4">
          <button
            onClick={onConfirmDelete}
            className="bg-red-500 hover:bg-red-600 transition duration-200 text-white px-4 py-2 rounded-lg mx-2"
          >
            Delete
          </button>
          <button
            onClick={onRequestClose}
            className="text-black bg-gray-300 hover:bg-gray-400 transition duration-200 px-4 py-2 rounded-lg mx-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeletionConfirmationModal
