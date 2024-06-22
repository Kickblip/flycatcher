import Modal from "react-modal"
import { Suggestion } from "@/types/SuggestionBoard"

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
}

const SuggestionAdditionalInfoModal = ({ isOpen, onRequestClose, suggestion }: SuggestionAdditionalInfoModalProps) => {
  if (!suggestion) return null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={suggestionAdditionalInfoModalStyles}
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
                <p className="text-sm text-black">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-black">No comments yet.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SuggestionAdditionalInfoModal
