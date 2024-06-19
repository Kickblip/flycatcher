import Link from "next/link"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4">
        <Hero />
      </div>
    </main>
  )
}
