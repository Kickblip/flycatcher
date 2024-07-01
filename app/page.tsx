import type { Metadata } from "next"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Demo from "@/components/landing/Demo"
import GettingStarted from "@/components/landing/GettingStarted"
import Customization from "@/components/landing/Customization"
import Pricing from "@/components/landing/Pricing"
import Footer from "@/components/landing/Footer"

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
        <Demo />
        <GettingStarted />
        <Customization />
        <Pricing />
      </div>
      <Footer />
    </main>
  )
}
