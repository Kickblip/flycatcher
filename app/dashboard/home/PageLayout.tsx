"use client"

import { useState } from "react"
import UserProjectsPanel from "./UserProjectsPanel"
import NewProjectPanel from "./NewProjectPanel"
import { Project } from "@/types/Project"

export default function PageLayout() {
  const [projects, setProjects] = useState<Project[]>([])

  return (
    <div className="w-full max-w-7xl mx-auto md:p-4 flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 p-4">
        <UserProjectsPanel projects={projects} setProjects={setProjects} />
      </div>
      <div className="w-full md:w-1/3 p-4">
        <NewProjectPanel projects={projects} setProjects={setProjects} />
      </div>
    </div>
  )
}
