"use client"

import { useState, useEffect } from "react"
import { Project } from "@/types/Project"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@/hooks/supabase"

export default function NewProjectPanel({
  projects,
  setProjects,
}: {
  projects: Project[]
  setProjects: (projects: Project[]) => void
}) {
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const { user, stripeData, error } = useUser()

  useEffect(() => {
    if (user) {
      if (stripeData?.is_premium) {
        setIsPremium(true)
      }
    }
  }, [user])

  const handleSubmit = async () => {
    if (!projectName) {
      toast.error("Project name is required")
      return
    }

    if (!isPremium && projects.length >= 1) {
      toast.error("Project limit for the free plan reached.")
      return
    }

    if (isPremium && projects.length >= 10) {
      toast.error("Project limit for the growth plan reached.")
      return
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(projectName)) {
      toast.error("Project name can only contain letters, numbers, and spaces")
      return
    }

    if (projectName.length > 60) {
      toast.error("Project name must be less than 60 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create Project")
      }

      const data = await response.json()
      setProjectName("")
      setProjects([...projects, data.project])
      toast.success("Project created.")
    } catch (error) {
      toast.error("Failed to create project. " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col p-4 space-y-8 bg-gray-50 border rounded-lg">
      <h2 className="text-xl font-bold">Create a new project</h2>
      <div className="flex flex-col">
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  )
}
