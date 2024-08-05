import { HexColorPicker } from "react-colorful"
import Modal from "react-modal"

type ColorSelectorModalProps = {
  isOpen: boolean
  currentColor: string
  onRequestClose: () => void
  onColorChange: (color: string) => void
  onSave: () => void
}

const ColorSelectorModal = ({ isOpen, currentColor, onRequestClose, onColorChange, onSave }: ColorSelectorModalProps) => {
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Color Picker Modal">
      <div className="p-4">
        <HexColorPicker color={currentColor} onChange={onColorChange} />
        <div className="mt-4 flex items-center">
          <label className="mr-2 text-sm font-bold text-gray-700" htmlFor="hexInput">
            Hex Code:
          </label>
          <input
            id="hexInput"
            type="text"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-24 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={onSave}
            className="bg-indigo-500 hover:bg-indigo-600 transition duration-200 text-white px-4 py-2 rounded-lg mx-2"
          >
            Save
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

export default ColorSelectorModal
