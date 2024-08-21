"use client"

import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import tinycolor from "tinycolor2"
import { useState } from "react"

export default function SignupForm({
  urlName,
  primaryColor,
  secondaryColor,
  textColor,
  accentColor,
}: {
  urlName: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
}) {
  const [email, setEmail] = useState("")

  const createContact = async () => {
    setEmail(email.trim())

    if (!email) {
      return
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email")
      return
    }

    try {
      const response = await fetch("/api/pub/create-contact", {
        method: "POST",
        body: JSON.stringify({ email, urlName }),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      toast.success("Added to waitlist!")
      setEmail("")
    } catch (error) {
      console.error("Error creating contact:", error)
    }
  }

  return (
    <div>
      <div className="flex flex-col w-full space-y-1">
        <div className="flex flex-col w-full">
          <label className="text-sm opacity-80 font-semibold mb-1" style={{ color: textColor }}>
            Email
            <span style={{ color: accentColor }}>*</span>
          </label>
          <style jsx>{`
            #input-email::placeholder {
              color: ${tinycolor(textColor).setAlpha(0.3).toRgbString()};
            }
          `}</style>
          <input
            id={`input-email`}
            type="email"
            className="px-2 py-2 text-md p-1 border rounded w-full"
            style={{
              backgroundColor: primaryColor,
              borderColor: tinycolor(textColor).setAlpha(0.3).toRgbString(),
              color: textColor,
            }}
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <button
        className="px-4 py-2 text-md font-medium w-full text-white rounded mt-4"
        style={{ backgroundColor: accentColor, color: secondaryColor }}
        onClick={createContact}
      >
        Join waitlist
      </button>
    </div>
  )
}
