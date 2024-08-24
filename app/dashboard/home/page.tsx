import type { Metadata } from "next"
import Navbar from "./Navbar"
import PageLayout from "./PageLayout"

export const metadata: Metadata = {
  title: "Projects | Flycatcher",
  description: "Manage and view your projects",
}

export default function DashboardHome() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <PageLayout />
    </main>
  )
}
