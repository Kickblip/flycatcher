"use client"

import Modal from "react-modal"
import { Board } from "@/types/SuggestionBoard"
import { TrashIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { Switch } from "@headlessui/react"
import { UploadButton, UploadDropzone } from "@/utils/uploadthing"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
    width: "50%",
  },
}

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
  const [forceSignIn, setForceSignIn] = useState(false)
  const [disableBranding, setDisableBranding] = useState(false)

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Settings Modal">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6">Board Settings</h1>
        <h2 className="font-semibold text-gray-900 mb-4">General Settings</h2>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-[40%]">
              <h2 className="font-semibold text-gray-900">Force sign in</h2>
              <p className="text-gray-600 text-sm">
                Require users to sign in before interacting with your board. Enable this setting if you are receiving a high
                volume of low quality interactions.
              </p>
            </div>
            <Switch
              checked={forceSignIn}
              onChange={setForceSignIn}
              className={`${
                forceSignIn ? "bg-indigo-500" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ml-4`}
            >
              <span
                className={`${
                  forceSignIn ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-[40%]">
              <h2 className="font-semibold text-gray-900">Disable Flycatcher branding</h2>
              <p className="text-gray-600 text-sm">Remove the Flycatcher "powered by" badge from your board's public view.</p>
            </div>
            <Switch
              checked={disableBranding}
              onChange={setDisableBranding}
              className={`${
                disableBranding ? "bg-indigo-500" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ml-4`}
            >
              <span
                className={`${
                  disableBranding ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
        <h2 className="font-semibold text-gray-900 mb-4">Custom Branding</h2>
        <UploadButton
          endpoint="boardLogo"
          input={currentBoard.urlName}
          onClientUploadComplete={(res) => {
            console.log("Files: ", res)
            toast.success("Logo updated successfully.")
          }}
          onUploadError={(error: Error) => {
            console.error(error.message)
            toast.error("Failed to update logo.")
          }}
        />
        <button
          className="flex items-center px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition duration-200"
          onClick={() => setDeletionConfirmationModalIsOpen(true)}
        >
          <span className="text-sm font-light">Delete board</span>
          <TrashIcon className="w-5 h-5 ml-2" strokeWidth={1.5} />
        </button>
      </div>
    </Modal>
  )
}

export default SettingsModal
