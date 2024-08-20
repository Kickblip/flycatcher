"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function EmailForm({ urlName }: { urlName: string }) {
  const [email, setEmail] = useState("")

  const unsubscribeUser = async () => {
    if (!email) {
      return
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email")
      return
    }

    try {
      const response = await fetch("/api/pub/remove-contact", {
        method: "POST",
        body: JSON.stringify({ email, urlName }),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      toast.success("Unsubscribed")
      setEmail("")
    } catch (error) {
      console.error("Error removing contact:", error)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Unsubscribe</h1>
      <p className="text-sm text-gray-500">Enter your email to unsubscribe from this waitlist</p>
      <div className="flex flex-col items-center space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-64 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
        />
        <button
          className="w-64 p-2 bg-redorange-500 hover:bg-redorange-300 transition duration-200 text-white rounded"
          onClick={unsubscribeUser}
        >
          Unsubscribe
        </button>
      </div>
    </div>
  )
}
