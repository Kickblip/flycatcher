"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LoadingWheel from "@/components/shared/LoadingWheel"
import { Project } from "@/types/Project"
import { FaChevronRight, FaGear, FaArrowsRotate } from "react-icons/fa6"

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
    <div className="flex flex-col p-4 space-y-8 h-full rounded-lg">
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
            <Link
              href={`/dashboard/${project.urlName}/customize`}
              key={index}
              className="px-4 py-6 border rounded-lg break-words hover:shadow transition duration-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{project.name}</h3>
              </div>
            </Link>
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
