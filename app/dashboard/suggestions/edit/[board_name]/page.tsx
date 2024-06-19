"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/dashboard/Navbar"
import { HexColorPicker } from "react-colorful"
import Modal from "react-modal"
import Link from "next/link"
import { ArrowTopRightOnSquareIcon, DocumentDuplicateIcon, DocumentCheckIcon } from "@heroicons/react/24/outline"

// for the modal
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

// change the label text color based on the rectangle background color
const getTextColor = (backgroundColor: string) => {
  const hex = backgroundColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 186 ? "text-black" : "text-white"
}

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<any>(null) // TODO: Define types
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState("")
  const [currentColorKey, setCurrentColorKey] = useState("")
  const [copyIcon, setCopyIcon] = useState("copy")

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
    return <div className="text-red-500">{error}</div>
  }

  if (!board && !error) {
    return <div>Loading...</div>
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
    navigator.clipboard.writeText(`https://www.flycatcher.io/sb/${board.urlName}`)
    setCopyIcon("check")
    setTimeout(() => setCopyIcon("copy"), 2000)
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex">
        <div className="flex flex-col w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-8">{board.name}</h2>
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-8 w-full">
            <span>{`https://www.flycatcher.io/sb/${board.urlName}`}</span>
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
        <div className="w-1/2 p-4">
          <h3 className="text-lg font-semibold mb-2">User Feedback</h3>
          {board.suggestions.length > 0 ? (
            <ul className="list-disc pl-5">
              {board.suggestions.map((suggestion: any, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p>No feedback yet.</p>
          )}
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Color Picker Modal">
        <HexColorPicker color={currentColor} onChange={handleColorChange} />
        <div className="flex justify-end mt-4">
          <button
            onClick={saveColor}
            className="bg-indigo-500 hover:bg-indigo-600 transition duration-200 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="text-black bg-gray-300 hover:bg-gray-400 transition duration-200 px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </main>
  )
}
