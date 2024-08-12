"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LoadingWheel from "@/components/shared/LoadingWheel"
import { Project } from "@/types/Project"
import { FaArrowsRotate } from "react-icons/fa6"
import DeleteButton from "./DeleteButton"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function UserProjectsPanel({
  projects,
  setProjects,
}: {
  projects: Project[]
  setProjects: (projects: Project[]) => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/projects/get-user-projects", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch projects")
      }

      const data = await response.json()
      setProjects(data.projects)
    } catch (error) {
      setError((error as Error).message || "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (urlName: string) => {
    try {
      const response = await fetch("/api/projects/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urlName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error("Failed to delete project")
        throw new Error(errorData.message || "Failed to delete project")
      }

      toast.success("Project deleted successfully")
      const newProjects = projects.filter((project) => project.urlName !== urlName)
      setProjects(newProjects)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  if (loading) {
    return <LoadingWheel />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col p-4 space-y-8 h-full rounded">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold opacity-90">Your Projects</h2>
        <button
          onClick={fetchProjects}
          className="flex items-center text-redorange-500 hover:text-redorange-300 transition duration-200"
        >
          <FaArrowsRotate className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className="flex item-center w-full justify-between hover:shadow transition duration-200 border rounded"
            >
              <Link href={`/dashboard/${project.urlName}/customize`} className="px-4 py-6 w-full">
                <h3 className="text-lg font-bold truncate">{project.name}</h3>
              </Link>
              <div className="flex items-center mr-3">
                <DeleteButton
                  target={"project"}
                  onConfirm={() => {
                    deleteProject(project.urlName)
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-left text-gray-500">
            <p>No projects found. Create a new one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
