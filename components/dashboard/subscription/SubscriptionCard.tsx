"use client"

import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function SubscriptionCard({
  title,
  subtitle,
  price,
  features,
}: {
  title: string
  subtitle: string
  price: number
  features: string[]
}) {
  const handleCheckout = async () => {
    const lineItems = [
      {
        price: process.env.NEXT_PUBLIC_GROWTH_MONTHLY_PRICE_ID as string,
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
    <div className="w-[26rem] p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <h3 className="text-3xl font-semibold mb-2">{title}</h3>
          <p className="text-sm font-normal text-gray-500 mb-4">{subtitle}</p>
          <p className="text-5xl font-semibold mb-4">
            ${price}
            <span className="text-sm font-normal text-gray-600">/month</span>
          </p>
          <button
            className={`block w-full transition duration-200 font-semibold py-2 px-4 rounded-lg ${
              title === "Free" ? "border-2 border-indigo-500 text-indigo-500" : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
            disabled={title === "Free"}
            onClick={handleCheckout}
          >
            {title === "Free" ? "Current" : "Upgrade"}
          </button>
          <p className="text-lg font-medium my-4">What you get:</p>
          <ul className="mb-4 space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                <li key={index} className="text-sm font-normal text-gray-500">
                  {feature}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
