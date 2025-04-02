"use client"

import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { loadStripe } from "@stripe/stripe-js"
import { FaCheck } from "react-icons/fa6"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function SubscriptionCard({ title, subtitle, price }: { title: string; subtitle: string; price: number }) {
  const growthFeatures = ["Unlimited contacts", "Unlimited projects", "Remove our branding"]

  const handleCheckout = async () => {
    const lineItems = [
      {
        price: process.env.NEXT_PUBLIC_GROWTH_PRICE_ID as string,
        quantity: 1,
      },
    ]

    try {
      const response = await fetch(`/api/stripe/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify({ lineItems }),
      })

      const { sessionId, checkoutError } = await response.json()

      if (!sessionId || checkoutError) {
        throw new Error(checkoutError || "Error creating checkout session")
      }

      const stripe = await stripePromise
      if (!stripe) throw new Error("Failed to load Stripe")

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        if (error instanceof Error) throw new Error(error.message)
      } else {
        throw error
      }
    } catch (error: any) {
      toast.error(error?.message || "Error creating checkout session")
      console.error("Error creating checkout session:", error)
    }
  }

  return (
    <div className="w-80 md:w-96 bg-redorange-500 text-white shadow rounded">
      <div className="p-4">
        <h3 className="text-3xl font-semibold my-2">{title}</h3>
        <p className="text-sm font-normal text-gray-100">{subtitle}</p>
        <p className="text-5xl font-semibold my-6">
          ${process.env.NEXT_PUBLIC_GROWTH_PRICE}
          <span className="text-xs opacity-90 ml-1 font-normal text-white">one time payment</span>
        </p>
        <button
          className="block w-full text-center font-semibold py-2 px-4 rounded bg-white text-redorange-500"
          onClick={handleCheckout}
        >
          Upgrade
        </button>
        <p className="text-lg font-medium mb-4 mt-6">What you get:</p>
        <ul className="mb-4 space-y-3">
          {growthFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FaCheck className="h-4 w-4 text-white" />
              <li className="text-sm font-normal text-gray-100">{feature}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}
