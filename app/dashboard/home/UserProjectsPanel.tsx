"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import LoadingWheel from "@/components/shared/LoadingWheel"
import { Project } from "@/types/Project"
import { FaChevronRight, FaGear } from "react-icons/fa6"

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
          className="flex items-center text-indigo-500 hover:text-indigo-700 transition duration-200"
        >
          <ArrowPathIcon className="h-5 w-5 mr-1" />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div className="px-4 py-6 border rounded-lg break-words">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{project.name}</h3>
                <Link
                  href={`/dashboard/${project.urlName}/settings`}
                  className="text-gray-700 p-2 hover:bg-gray-100 transition duration-200 rounded cursor-pointer"
                >
                  <FaGear />
                </Link>
              </div>

              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  key={index}
                  href={`/dashboard/${project.urlName}/feedback`}
                  className="border hover:shadow-md transition duration-200 rounded-lg text-sm w-full px-6 py-4"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <p>Discussions</p>
                    <FaChevronRight className="w-3 h-3" />
                  </div>
                </Link>

                <Link
                  key={index}
                  href={`/w/${project.urlName}`}
                  className="border hover:shadow-md transition duration-200 rounded-lg text-sm text-center w-full px-6 py-4"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <p>Waitlist</p>
                    <FaChevronRight className="w-3 h-3" />
                  </div>
                </Link>
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
