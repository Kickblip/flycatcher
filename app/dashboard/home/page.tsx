import type { Metadata } from "next"
import Navbar from "@/components/dashboard/Navbar"
import PageLayout from "./PageLayout"

export const metadata: Metadata = {
  title: "Suggestion Boards | Flycatcher",
  description: "Manage and view your suggestion boards",
}

export default function DashboardHome() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <PageLayout />
    </main>
  )
}
