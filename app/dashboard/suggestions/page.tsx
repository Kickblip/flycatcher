import type { Metadata } from "next"
import Navbar from "@/components/dashboard/Navbar"
import NewBoardPanel from "@/components/dashboard/suggestions/NewBoardPanel"

export const metadata: Metadata = {
  title: "Suggestion Boards | Flycatcher",
  description: "Manage and view your suggestion boards",
}

export default function DashboardSuggestions() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4 flex">
        <div className="w-2/3 p-4">
          {/* Viewer content */}
          <p>Viewer</p>
        </div>
        <div className="w-1/3 p-4">
          <NewBoardPanel />
        </div>
      </div>
    </main>
  )
}
