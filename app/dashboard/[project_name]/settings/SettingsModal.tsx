"use client"

import Modal from "react-modal"
import { Project } from "@/types/Project"
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { Switch } from "@headlessui/react"
import { UploadButton } from "@/utils/uploadthing"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { useUser } from "@/hooks/supabase"

type SettingsModalProps = {
  isOpen: boolean
  currentProject: Project
  onRequestClose: () => void
  onSettingsSave: (updatedProject: Project) => void
  setDeletionConfirmationModalIsOpen: (isOpen: boolean) => void
  setProject: (project: Project) => void
}

const SettingsModal = ({
  isOpen,
  currentProject,
  onRequestClose,
  onSettingsSave,
  setDeletionConfirmationModalIsOpen,
  setProject,
}: SettingsModalProps) => {
  const [disableBranding, setDisableBranding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState("")
  const [favicon, setFavicon] = useState("")
  const [feedbackMetadataTabTitle, setFeedbackMetadataTabTitle] = useState("")
  const [projectName, setProjectName] = useState("")
  const [prevDisableBranding, setPrevDisableBranding] = useState(false)
  const [prevMetadataTabTitle, setPrevMetadataTabTitle] = useState("")
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const { user, stripeData, error } = useUser()

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      width:
        screenWidth <= 640
          ? "95%"
          : screenWidth <= 768
          ? "90%"
          : screenWidth <= 950
          ? "90%"
          : screenWidth <= 1050
          ? "70%"
          : "50%",
    },
  }

  useEffect(() => {
    setDisableBranding(currentProject.settings.disableBranding)
    setPrevDisableBranding(currentProject.settings.disableBranding)
    setLogo(currentProject.settings.logo)
    setFavicon(currentProject.settings.favicon)
    setFeedbackMetadataTabTitle(currentProject.settings.feedbackMetadataTabTitle)
    setPrevMetadataTabTitle(currentProject.settings.feedbackMetadataTabTitle)
    setProjectName(currentProject.name)
  }, [currentProject])

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth))
    return () => {
      window.removeEventListener("resize", () => setScreenWidth(window.innerWidth))
    }
  }, [])

  const saveSettings = async () => {
    if (feedbackMetadataTabTitle.length > 60) {
      toast.error("Metadata tab title must be less than 60 characters.")
      return
    }
    if (disableBranding === prevDisableBranding && feedbackMetadataTabTitle === prevMetadataTabTitle) {
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/update-settings`, {
        method: "POST",
        body: JSON.stringify({
          feedbackMetadataTabTitle,
          disableBranding,
          urlName: currentProject.urlName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Project does not exist")
      }

      toast.success("Settings saved.")
    } catch (error) {
      toast.error("Error saving settings.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Settings Modal">
      <div className="p-2 md:p-4">
        <div className="flex items-center justify-between mb-6 w-full">
          <h1 className="text-xl font-semibold">Project Settings</h1>
          <button
            className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 transition duration-200 text-white rounded-lg"
            onClick={saveSettings}
          >
            Save
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-full md:w-[85%] lg:w-[55%]">
              <h2 className="font-semibold text-gray-900">Disable Flycatcher branding</h2>
              <p className="text-gray-600 text-sm">
                Remove the Flycatcher "powered by" badge from your feedback board and waitlist page public views.
              </p>
            </div>
            <Switch
              checked={disableBranding}
              onChange={() => {
                if (stripeData?.is_premium) {
                  setDisableBranding(!disableBranding)
                } else {
                  toast.error("This feature is only available for paid users.")
                  setDisableBranding(false)
                }
              }}
              className={`${
                disableBranding ? "bg-indigo-500" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ml-4`}
            >
              <span
                className={`${
                  disableBranding ? "translate-x-5 md:translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-full md:w-[85%] lg:w-[55%]">
              <h2 className="font-semibold text-gray-900">Feedback board tab title</h2>
              <p className="text-gray-600 text-sm">
                Edit the title of the browser tab that users see on your board's public view.
              </p>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded-s-lg focus:border-indigo-500 focus:border-2 focus:outline-none"
                  value={feedbackMetadataTabTitle}
                  onChange={(e) => setFeedbackMetadataTabTitle(e.target.value)}
                />
                <button
                  className="p-2 bg-indigo-500 hover:bg-indigo-600 transition duration-200 text-white rounded-e-lg"
                  onClick={() => setFeedbackMetadataTabTitle(`Feedback | ${projectName}`)}
                  title="Reset to default"
                >
                  <ArrowPathIcon className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOGO UPLOAD */}
        <h2 className="font-semibold text-gray-900">Custom Logo</h2>
        <div className="flex space-x-8 my-2 w-full">
          <div className="w-[45%]" hidden={!logo}>
            <Image src={logo} alt="Logo" width={300} height={300} />
          </div>
          <UploadButton
            endpoint="projectLogo"
            input={currentProject.urlName}
            onClientUploadComplete={(res) => {
              toast.success("Logo updated successfully.")
              setLogo(res[0].url)
              setProject({
                ...currentProject,
                settings: {
                  ...currentProject.settings,
                  logo: res[0].url,
                },
              })
            }}
            onUploadError={(error: Error) => {
              console.error(error.message)
              toast.error("Failed to update logo.")
            }}
            appearance={{
              button: {
                backgroundColor: "#6366f1",
                color: "fff",
                padding: "0.5rem 1rem",
              },
            }}
          />
        </div>

        {/* FAVICON UPLOAD */}
        <h2 className="font-semibold text-gray-900">Custom Favicon</h2>
        <div className="flex space-x-8 my-2 w-full">
          <div className="w-[45%]" hidden={!favicon}>
            <Image src={favicon} alt="Favicon" width={50} height={50} />
          </div>
          <UploadButton
            endpoint="projectFavicon"
            input={currentProject.urlName}
            onClientUploadComplete={(res) => {
              toast.success("Favicon updated successfully.")
              setFavicon(res[0].url)
              setProject({
                ...currentProject,
                settings: {
                  ...currentProject.settings,
                  favicon: res[0].url,
                },
              })
            }}
            onUploadError={(error: Error) => {
              console.error(error.message)
              toast.error("Failed to update favicon.")
            }}
            appearance={{
              button: {
                backgroundColor: "#6366f1",
                color: "fff",
                padding: "0.5rem 1rem",
              },
            }}
          />
        </div>

        <button
          className="flex items-center px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition duration-200"
          onClick={() => setDeletionConfirmationModalIsOpen(true)}
        >
          <span className="text-sm font-light">Delete project</span>
          <TrashIcon className="w-5 h-5 ml-2" strokeWidth={1.5} />
        </button>
      </div>
    </Modal>
  )
}

export default SettingsModal
