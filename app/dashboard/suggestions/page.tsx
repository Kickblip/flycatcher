import type { Metadata } from "next"
import Navbar from "@/components/dashboard/Navbar"
import SuggestionsPageLayout from "@/components/dashboard/suggestions/SuggestionsPageLayout"

export const metadata: Metadata = {
  title: "Suggestion Boards | Flycatcher",
  description: "Manage and view your suggestion boards",
}

export default function DashboardSuggestions() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <SuggestionsPageLayout />
    </main>
  )
}
