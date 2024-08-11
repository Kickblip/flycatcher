"use client"

import { Field, SocialLinks } from "@/types/WaitlistPage"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import tinycolor from "tinycolor2"

export default function SignupForm({
  urlName,
  primaryColor,
  secondaryColor,
  textColor,
  accentColor,
  fields,
}: {
  urlName: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
  fields: Field[]
}) {
  const createContact = async () => {
    const data: { [key: string]: string | null } = {}

    fields.forEach((field, index) => {
      if (field.enabled) {
        const input = document.getElementById(`input-${index}`) as HTMLInputElement | null

        if (input) {
          data[field.label] = input.value || null
        } else {
          data[field.label] = null
        }
      }
    })

    try {
      const response = await fetch("/api/pub/create-contact", {
        method: "POST",
        body: JSON.stringify({ fields: data, urlName }),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      toast.success("Added to waitlist!")
    } catch (error) {
      console.error("Error creating contact:", error)
    }
  }

  return (
    <div>
      <div className="flex flex-col w-full space-y-1">
        {fields
          .filter((field) => field.enabled)
          .map((field, index) => (
            <div key={index} className="flex flex-col w-full">
              <label className="text-sm opacity-80 font-semibold mb-1" style={{ color: textColor }} htmlFor={`input-${index}`}>
                {field.label}
                <span style={{ color: accentColor }}>{field.required && "*"}</span>
              </label>
              <style jsx>{`
                #input-${index}::placeholder {
                  color: ${tinycolor(textColor).setAlpha(0.3).toRgbString()};
                }
              `}</style>
              <input
                id={`input-${index}`}
                type="text"
                className="px-2 py-2 text-md p-1 border rounded w-full"
                style={{
                  backgroundColor: primaryColor,
                  borderColor: tinycolor(textColor).setAlpha(0.3).toRgbString(),
                  color: textColor,
                }}
                placeholder={field.placeholder || field.label.toLowerCase()}
                required={field.required}
              />
            </div>
          ))}
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
