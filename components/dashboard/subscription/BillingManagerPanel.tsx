"use client"

import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function BillingManagerPanel() {
  const { user } = useUser()
  const [isCancelled, setIsCancelled] = useState(false)
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    if (user?.publicMetadata.stripeSubscriptionCancelAtPeriodEnd) {
      setIsCancelled(true)
    } else {
      setIsCancelled(false)
    }
    const stripeCurrentPeriodEnd = user?.publicMetadata.stripeCurrentPeriodEnd as number
    if (stripeCurrentPeriodEnd) {
      const nextChargeDate = new Date(stripeCurrentPeriodEnd * 1000)
      if (!isNaN(nextChargeDate.getTime())) {
        setFormattedDate(format(nextChargeDate, "PPP"))
      } else {
        setFormattedDate("")
      }
    } else {
      setFormattedDate("")
    }
  }, [user])

  const cancelStripeSubscription = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Subscription cancelled.")
        setIsCancelled(true)
      } else {
        toast.error("Error cancelling subscription.")
      }
    } catch (error) {
      toast.error("Error cancelling subscription.")
    }
  }

  const reactivateStripeSubscription = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/stripe/activate", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Subscription reactivated.")
        setIsCancelled(false)
      } else {
        toast.error("Error reactivating subscription.")
      }
    } catch (error) {
      toast.error("Error reactivating subscription.")
    }
  }

  return (
    <div className="w-full h-32 flex flex-col">
      <p className="font-semibold mt-4">Next Charge Date</p>
      <p className="text-gray-700">{isCancelled ? "Cancelled" : formattedDate}</p>
      <div className="flex items-center mt-4">
        {!isCancelled ? (
          <button
            className="bg-red-500 hover:bg-red-600 transition duration-200 px-4 py-2 rounded-lg font-semibold text-sm text-white"
            onClick={cancelStripeSubscription}
          >
            Cancel Subscription
          </button>
        ) : (
          <button
            className="bg-indigo-500 hover:bg-indigo-600 transition duration-200 px-4 py-2 rounded-lg font-semibold text-sm text-white"
            onClick={reactivateStripeSubscription}
          >
            Reactivate Subscription
          </button>
        )}
      </div>
    </div>
  )
}
