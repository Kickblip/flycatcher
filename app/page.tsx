import type { Metadata } from "next"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import Hero from "@/components/landing/Hero"
import DemoVideo from "@/components/landing/DemoVideo"
import IntroSection from "@/components/landing/IntroSection"
import Pricing from "@/components/landing/Pricing"
import Features from "@/components/landing/Features"
import Setup from "@/components/landing/Setup"

export const metadata: Metadata = {
  title: "Flycatcher",
  description: "Build a waitlist, measure analytics, and send emails with a single app.",
}

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto p-4">
        <Hero />
        <DemoVideo />
        <IntroSection />
        <Features />
        <Setup />
        <Pricing />
      </div>
      <Footer />
    </main>
  )
}
