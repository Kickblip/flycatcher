import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Demo from "@/components/landing/Demo"

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-4">
        <Hero />
        <Demo />
      </div>
    </main>
  )
}
