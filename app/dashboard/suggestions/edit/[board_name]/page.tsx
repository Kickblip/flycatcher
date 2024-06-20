"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HexColorPicker } from "react-colorful"
import Modal from "react-modal"
import Link from "next/link"
import { ArrowTopRightOnSquareIcon, DocumentDuplicateIcon, DocumentCheckIcon, TrashIcon } from "@heroicons/react/24/outline"
import LoadingWheel from "@/components/dashboard/LoadingWheel"
import BoardPreviewPanel from "@/components/dashboard/suggestions/BoardPreviewPanel"
import PremadeThemeSquare from "@/components/dashboard/suggestions/PremadeThemeSquare"
import Navbar from "@/components/dashboard/Navbar"
import { themes, customStyles, getTextColor } from "./utils"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<any>(null) // TODO: Define types
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [deletionConfirmationModalIsOpen, setDeletionConfirmationModalIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState("")
  const [currentColorKey, setCurrentColorKey] = useState("")
  const [copyIcon, setCopyIcon] = useState("copy")
  const [headerStatusMessage, setHeaderStatusMessage] = useState<string | null>(null)
  const [headerStatusMessageType, setHeaderStatusMessageType] = useState<"success" | "error" | null>(null)

  const router = useRouter()

  const fetchBoard = async () => {
    setError(null)

    try {
      const response = await fetch(`/api/boards/full-data/${params.board_name}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Board does not exist")
      }

      const data = await response.json()
      setBoard(data)
    } catch (error) {
      setError((error as Error).message || "Board does not exist")
    }
  }

  useEffect(() => {
    fetchBoard()
  }, [params.board_name])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
        <Link href="/dashboard/suggestions" className="underline">
          Go back
        </Link>
      </div>
    )
  }

  if (!board && !error) {
    return <LoadingWheel />
  }

  const openModal = (colorKey: string, currentColor: string) => {
    setCurrentColor(currentColor)
    setCurrentColorKey(colorKey)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
  }

  const saveColor = () => {
    setBoard((prevBoard: any) => ({
      ...prevBoard,
      [currentColorKey]: currentColor,
    }))
    closeModal()
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`https://flycatcher.app/sb/${board.urlName}`)
    setCopyIcon("check")
    setTimeout(() => setCopyIcon("copy"), 2000)
  }

  const applyPremadeTheme = (theme: (typeof themes)[0]) => {
    setBoard({
      name: board.name,
      urlName: board.urlName,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      textColor: theme.textColor,
    })
  }

  const saveBoardChanges = async () => {
    try {
      const response = await fetch("/api/boards/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(board),
      })

      if (!response.ok) {
        throw new Error("Failed to save board")
      }
      setHeaderStatusMessage("Board saved successfully")
      setHeaderStatusMessageType("success")
      setTimeout(() => setHeaderStatusMessage(""), 2000)
    } catch (error) {
      console.error("Error saving board:", error)
      setHeaderStatusMessage("Failed to save board")
      setHeaderStatusMessageType("error")
      setTimeout(() => setHeaderStatusMessage(""), 2000)
    }
  }

  const deleteBoard = async () => {
    try {
      const response = await fetch("/api/boards/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(board),
      })

      if (!response.ok) {
        throw new Error("Failed to delete board")
      }

      router.push("/dashboard/suggestions")
    } catch (error) {
      console.error("Error deleting board:", error)
      setHeaderStatusMessage("Failed to delete board")
      setHeaderStatusMessageType("error")
      setTimeout(() => setHeaderStatusMessage(""), 2000)
    }
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex">
        <div className="flex flex-col w-1/2 p-4">
          <div className="flex justify-between w-full mb-8">
            <h2 className="text-2xl font-bold">{board.name}</h2>
            <div className="flex items-center space-x-2">
              {headerStatusMessage && (
                <span className={`px-4 py-2 ${headerStatusMessageType === "success" ? "text-gray-500" : "text-red-500"}`}>
                  {headerStatusMessage}
                </span>
              )}
              <button
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200"
                onClick={() => setDeletionConfirmationModalIsOpen(true)}
              >
                <TrashIcon className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
                onClick={saveBoardChanges}
              >
                Save Board
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-8 w-full">
            <span>{`https://flycatcher.app/sb/${board.urlName}`}</span>
            <div className="flex space-x-2">
              <Link href={`/sb/${board.urlName}`} target="_blank">
                <button className="p-2 rounded-lg hover:bg-gray-200 transition duration-200">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </button>
              </Link>
              <button onClick={handleCopyToClipboard} className="p-2 rounded-lg hover:bg-gray-200 transition duration-200">
                {copyIcon === "copy" ? <DocumentDuplicateIcon className="w-5 h-5" /> : <DocumentCheckIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mb-8 w-full">
            <div className="border-t border-gray-300 flex-grow mr-2"></div>
            <span className="text-gray-500">Choose a Theme</span>
            <div className="border-t border-gray-300 flex-grow ml-2"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {themes.map((theme, index) => (
              <PremadeThemeSquare key={index} theme={theme} index={index} applyPremadeTheme={applyPremadeTheme} />
            ))}
          </div>
          <div className="flex items-center justify-center mb-8 w-full">
            <div className="border-t border-gray-300 flex-grow mr-2"></div>
            <span className="text-gray-500">Or Make Your Own</span>
            <div className="border-t border-gray-300 flex-grow ml-2"></div>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: board.primaryColor }}
                onClick={() => openModal("primaryColor", board.primaryColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    board.primaryColor,
                  )}`}
                >
                  Primary Color
                </h3>
              </div>
            </div>
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: board.secondaryColor }}
                onClick={() => openModal("secondaryColor", board.secondaryColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    board.secondaryColor,
                  )}`}
                >
                  Secondary Color
                </h3>
              </div>
            </div>
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: board.accentColor }}
                onClick={() => openModal("accentColor", board.accentColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    board.accentColor,
                  )}`}
                >
                  Accent Color
                </h3>
              </div>
            </div>
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: board.textColor }}
                onClick={() => openModal("textColor", board.textColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    board.textColor,
                  )}`}
                >
                  Text Color
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 shadow-xl rounded-lg">
          <BoardPreviewPanel {...board} />
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Color Picker Modal">
        <div className="p-4">
          <HexColorPicker color={currentColor} onChange={handleColorChange} />
          <div className="mt-4 flex items-center">
            <label className="mr-2 text-sm font-bold text-gray-700" htmlFor="hexInput">
              Hex Code:
            </label>
            <input
              id="hexInput"
              type="text"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-24 p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={saveColor}
              className="bg-indigo-500 hover:bg-indigo-600 transition duration-200 text-white px-4 py-2 rounded-lg mx-2"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="text-black bg-gray-300 hover:bg-gray-400 transition duration-200 px-4 py-2 rounded-lg mx-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deletionConfirmationModalIsOpen}
        onRequestClose={() => setDeletionConfirmationModalIsOpen(false)}
        style={customStyles}
        contentLabel="Confirmation Modal"
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this board? This action cannot be undone.</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={deleteBoard}
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
    </main>
  )
}
