"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowTopRightOnSquareIcon, DocumentDuplicateIcon, DocumentCheckIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import LoadingWheel from "@/components/dashboard/LoadingWheel"
import BoardPreviewPanel from "@/components/dashboard/boards/BoardPreviewPanel"
import PremadeThemeSquare from "@/components/dashboard/boards/PremadeThemeSquare"
import DeletionConfirmationModal from "@/components/dashboard/boards/DeletionConfirmationModal"
import SettingsModal from "@/components/dashboard/boards/SettingsModal"
import ColorSelectorModal from "@/components/dashboard/boards/ColorSelectorModal"
import Navbar from "@/components/dashboard/Navbar"
import { themes, getTextColor } from "./utils"
import { Board } from "@/types/SuggestionBoard"

export default function BoardInfo({ params }: { params: { board_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [board, setBoard] = useState<any>(null) // TODO: Define types
  const [currentColor, setCurrentColor] = useState("")
  const [currentColorKey, setCurrentColorKey] = useState("")
  const [copyIcon, setCopyIcon] = useState("copy")
  const [headerStatusMessage, setHeaderStatusMessage] = useState<string | null>(null)
  const [headerStatusMessageType, setHeaderStatusMessageType] = useState<"success" | "error" | null>(null)

  const [colorSelectorModalIsOpen, setColorSelectorModalIsOpen] = useState(false)
  const [deletionConfirmationModalIsOpen, setDeletionConfirmationModalIsOpen] = useState(false)
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)

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
        <Link href="/dashboard/boards" className="underline">
          Go back
        </Link>
      </div>
    )
  }

  if (!board && !error) {
    return <LoadingWheel />
  }

  const openColorSelectorModal = (colorKey: string, currentColor: string) => {
    setCurrentColor(currentColor)
    setCurrentColorKey(colorKey)
    setColorSelectorModalIsOpen(true)
  }

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
  }

  const saveColor = () => {
    setBoard((prevBoard: any) => ({
      ...prevBoard,
      [currentColorKey]: currentColor,
    }))
    setColorSelectorModalIsOpen(false)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`https://flycatcher.app/b/${board.urlName}`)
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
      setHeaderStatusMessage("Saved board")
      setHeaderStatusMessageType("success")
      setTimeout(() => setHeaderStatusMessage(""), 2000)
    } catch (error) {
      console.error("Error saving board:", error)
      setHeaderStatusMessage("Save failed")
      setHeaderStatusMessageType("error")
      setTimeout(() => setHeaderStatusMessage(""), 2000)
    }
  }

  const handleSettingsSave = (updatedBoard: Board) => {}

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

      router.push("/dashboard/boards")
    } catch (error) {
      console.error("Error deleting board:", error)
      setHeaderStatusMessage("Save failed")
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
                <span className={`py-2 text-xs ${headerStatusMessageType === "success" ? "text-gray-500" : "text-red-500"}`}>
                  {headerStatusMessage}
                </span>
              )}
              <button
                className="px-4 py-2 border border-gray-400 text-gray-800 hover:text-gray-900 hover:border-gray-500 rounded-lg transition duration-200"
                onClick={() => setSettingsModalIsOpen(true)}
              >
                <Cog6ToothIcon className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <Link
                href={`/dashboard/boards/edit/${params.board_name}/feedback`}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
              >
                View Feedback
              </Link>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
                onClick={saveBoardChanges}
              >
                Save Board
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-8 w-full">
            <span>{`https://flycatcher.app/b/${board.urlName}`}</span>
            <div className="flex space-x-2">
              <Link href={`/b/${board.urlName}`} target="_blank">
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
                onClick={() => openColorSelectorModal("primaryColor", board.primaryColor)}
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
                onClick={() => openColorSelectorModal("secondaryColor", board.secondaryColor)}
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
                onClick={() => openColorSelectorModal("accentColor", board.accentColor)}
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
                onClick={() => openColorSelectorModal("textColor", board.textColor)}
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
      <ColorSelectorModal
        isOpen={colorSelectorModalIsOpen}
        currentColor={currentColor}
        onRequestClose={() => setColorSelectorModalIsOpen(false)}
        onColorChange={handleColorChange}
        onSave={saveColor}
      />
      <SettingsModal
        isOpen={settingsModalIsOpen}
        currentBoard={board}
        onRequestClose={() => setSettingsModalIsOpen(false)}
        onSettingsSave={handleSettingsSave}
        setDeletionConfirmationModalIsOpen={setDeletionConfirmationModalIsOpen}
      />
      <DeletionConfirmationModal
        isOpen={deletionConfirmationModalIsOpen}
        onRequestClose={() => setDeletionConfirmationModalIsOpen(false)}
        onConfirmDelete={deleteBoard}
        contentMessage="Are you sure you want to delete this board? This action cannot be undone."
      />
    </main>
  )
}
