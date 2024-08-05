"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowTopRightOnSquareIcon, DocumentDuplicateIcon, DocumentCheckIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import LoadingWheel from "@/components/shared/LoadingWheel"
import BoardPreviewPanel from "@/app/dashboard/[project_name]/settings/BoardPreviewPanel"
import PremadeThemeSquare from "@/app/dashboard/[project_name]/settings/PremadeThemeSquare"
import DeletionConfirmationModal from "@/components/dashboard/boards/DeletionConfirmationModal"
import SettingsModal from "@/app/dashboard/[project_name]/settings/SettingsModal"
import ColorSelectorModal from "@/app/dashboard/[project_name]/settings/ColorSelectorModal"
import Navbar from "@/components/dashboard/Navbar"
import { themes, getTextColor } from "./utils"
import { Board } from "@/types/SuggestionBoard"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Project } from "@/types/Project"

export default function BoardInfo({ params }: { params: { project_name: string } }) {
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<any>(null) // TODO: Define types
  const [currentColor, setCurrentColor] = useState("")
  const [currentColorKey, setCurrentColorKey] = useState("")
  const [copyIcon, setCopyIcon] = useState("copy")

  const [colorSelectorModalIsOpen, setColorSelectorModalIsOpen] = useState(false)
  const [deletionConfirmationModalIsOpen, setDeletionConfirmationModalIsOpen] = useState(false)
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)

  const router = useRouter()

  const fetchProject = async () => {
    setError(null)

    try {
      const response = await fetch(`/api/projects/partial-data/${params.project_name}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Project does not exist")
      }

      const data = await response.json()
      setProject(data)
    } catch (error) {
      setError((error as Error).message || "Project does not exist")
    }
  }

  useEffect(() => {
    fetchProject()
  }, [params.project_name])

  useEffect(() => {
    if (project) document.title = `Editing ${project.name} | Flycatcher`
  }, [project])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
        <Link href="/dashboard/home" className="underline">
          Go back
        </Link>
      </div>
    )
  }

  if (!project && !error) {
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
    setProject((prevProject: Project) => ({
      ...prevProject,
      settings: {
        ...prevProject.settings,
        [currentColorKey]: currentColor,
      },
    }))
    setColorSelectorModalIsOpen(false)
  }

  const applyPremadeTheme = (theme: (typeof themes)[0]) => {
    setProject({
      ...project,
      settings: {
        ...project.settings,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        accentColor: theme.accentColor,
        textColor: theme.textColor,
      },
    })
  }

  const saveBoardChanges = async () => {
    try {
      const response = await fetch("/api/projects/update-colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }
      toast.success("Project saved.")
    } catch (error) {
      toast.error("Failed to save project.")
    }
  }

  const handleSettingsSave = (updatedProject: Project) => {
    // TODO: Implement
  }

  const deleteProject = async () => {
    try {
      const response = await fetch("/api/projects/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      router.push("/dashboard/home")
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row">
        <div className="flex flex-col w-full md:w-1/2 p-4">
          <div className="flex flex-col md:flex-row justify-between w-full mb-8">
            <h2 className="text-2xl font-bold max-w-[55%] break-words">{project.name}</h2>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                className="px-4 py-2 border border-gray-400 text-gray-800 hover:text-gray-900 hover:border-gray-500 rounded-lg transition duration-200"
                onClick={() => setSettingsModalIsOpen(true)}
              >
                <Cog6ToothIcon className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
                onClick={saveBoardChanges}
              >
                Save
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mb-8 w-full">
            <div className="border-t border-gray-300 flex-grow mr-2"></div>
            <span className="text-gray-500">Choose a Theme</span>
            <div className="border-t border-gray-300 flex-grow ml-2"></div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-8">
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
                style={{ backgroundColor: project.settings.primaryColor }}
                onClick={() => openColorSelectorModal("primaryColor", project.settings.primaryColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    project.settings.primaryColor,
                  )}`}
                >
                  Primary Color
                </h3>
              </div>
            </div>
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: project.settings.secondaryColor }}
                onClick={() => openColorSelectorModal("secondaryColor", project.settings.secondaryColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    project.settings.secondaryColor,
                  )}`}
                >
                  Secondary Color
                </h3>
              </div>
            </div>
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: project.settings.accentColor }}
                onClick={() => openColorSelectorModal("accentColor", project.settings.accentColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    project.settings.accentColor,
                  )}`}
                >
                  Accent Color
                </h3>
              </div>
            </div>
            <div className="relative group w-full">
              <div
                className="w-full h-36 rounded-lg cursor-pointer transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: project.settings.textColor }}
                onClick={() => openColorSelectorModal("textColor", project.settings.textColor)}
              >
                <h3
                  className={`absolute text-lg font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getTextColor(
                    project.settings.textColor,
                  )}`}
                >
                  Text Color
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 shadow-xl rounded-lg">
          <BoardPreviewPanel {...project.settings} />
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
        currentProject={project}
        setProject={setProject}
        onRequestClose={() => setSettingsModalIsOpen(false)}
        onSettingsSave={handleSettingsSave}
        setDeletionConfirmationModalIsOpen={setDeletionConfirmationModalIsOpen}
      />
      <DeletionConfirmationModal
        isOpen={deletionConfirmationModalIsOpen}
        onRequestClose={() => setDeletionConfirmationModalIsOpen(false)}
        onConfirmDelete={deleteProject}
        contentMessage="Are you sure you want to delete this project? This action cannot be undone."
      />
    </main>
  )
}
