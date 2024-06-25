"use client"

import Modal from "react-modal"
import { Board } from "@/types/SuggestionBoard"
import { TrashIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { Switch } from "@headlessui/react"
import { UploadButton, UploadDropzone } from "@/utils/uploadthing"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"

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
  setBoard: (board: Board) => void
}

const SettingsModal = ({
  isOpen,
  currentBoard,
  onRequestClose,
  onSettingsSave,
  setDeletionConfirmationModalIsOpen,
  setBoard,
}: SettingsModalProps) => {
  const [forceSignIn, setForceSignIn] = useState(false)
  const [disableBranding, setDisableBranding] = useState(false)
  const [logo, setLogo] = useState("")
  const [favicon, setFavicon] = useState("")

  useEffect(() => {
    setForceSignIn(false)
    setDisableBranding(false)
    setLogo(currentBoard.logo)
    setFavicon(currentBoard.favicon)
  }, [currentBoard])

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Settings Modal">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6">Board Settings</h1>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-[55%]">
              <h2 className="font-semibold text-gray-900">Force sign in</h2>
              <p className="text-gray-600 text-sm">
                Require users to sign in before interacting with your board. Enable if you are receiving a high volume of low
                quality interactions.
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
            <div className="w-[55%]">
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

        {/* LOGO UPLOAD */}
        <h2 className="font-semibold text-gray-900">Custom Board Logo</h2>
        <div className="flex space-x-8 my-2 w-full">
          <div className="w-[45%]" hidden={!logo}>
            <Image src={logo} alt="Board Logo" width={300} height={300} />
          </div>
          <UploadButton
            endpoint="boardLogo"
            input={currentBoard.urlName}
            onClientUploadComplete={(res) => {
              toast.success("Logo updated successfully.")
              setLogo(res[0].url)
              setBoard({ ...currentBoard, logo: res[0].url })
            }}
            onUploadError={(error: Error) => {
              console.error(error.message)
              toast.error("Failed to update logo.")
            }}
            className="ut-label:text-indigo-500 ut-button:bg-indigo-500"
          />
        </div>

        {/* FAVICON UPLOAD */}
        <h2 className="font-semibold text-gray-900">Custom Board Favicon</h2>
        <div className="flex space-x-8 my-2 w-full">
          <div className="w-[45%]" hidden={!favicon}>
            <Image src={favicon} alt="Board Favicon" width={50} height={50} />
          </div>
          <UploadButton
            endpoint="boardFavicon"
            input={currentBoard.urlName}
            onClientUploadComplete={(res) => {
              toast.success("Favicon updated successfully.")
              setFavicon(res[0].url)
              setBoard({ ...currentBoard, favicon: res[0].url })
            }}
            onUploadError={(error: Error) => {
              console.error(error.message)
              toast.error("Failed to update favicon.")
            }}
            className="ut-label:text-indigo-500 ut-button:bg-indigo-500"
          />
        </div>

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
