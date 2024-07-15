"use client"

import Link from "next/link"
import Navbar from "@/components/dashboard/Navbar"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@/hooks/supabase"
import { createClient } from "@/utils/supabase/client"

export default function Checkout() {
  const { user, stripeData, error } = useUser()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")

  useEffect(() => {
    if (!sessionId || !user) return

    retrieveStripeCheckoutSession(sessionId).then((result) => {
      if (!result) {
        toast.error("Error retrieving checkout session")
        return
      }

      const { success, error } = result
      if (success) {
        toast.success("Checkout completed successfully. Thank you for joining Flycatcher.")
        const supabase = createClient()
        supabase.auth.refreshSession()
      }

      if (error) {
        toast.error("Failed to retrieve checkout session.")
      }
    })
  }, [sessionId, user?.id])

  const retrieveStripeCheckoutSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/retrieve-checkout-session`, {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      })

      const { success, error } = await response.json()

      return { success, error }
    } catch (error: any) {
      toast.error(error?.message || "Error retrieving checkout session")
      console.error("Error retrieving checkout session:", error)
    }
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <div className="w-full max-w-7xl p-4 flex flex-col items-center">
        <h1 className="text-lg font-medium text-indigo-500">Payment successful</h1>
        <p className="my-2 font-semibold text-3xl">Thank you for joining Flycatcher</p>
        <Link href="/dashboard/subscription" className="bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-white mt-6">
          Back to subscriptions
        </Link>
      </div>
    </main>
  )
}
