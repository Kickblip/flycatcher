import type { Metadata } from "next"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import Hero from "@/components/landing/Hero"
import DemoVideo from "@/components/landing/DemoVideo"

export const metadata: Metadata = {
  title: "Flycatcher",
  description: "Start collecting feedback from your users in minutes, not hours.",
}

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto p-4">
        <Hero />
        <DemoVideo />
      </div>
      <Footer />
    </main>
  )
}
