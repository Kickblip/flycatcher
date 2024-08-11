"use client"

import { Field, WaitlistPage } from "@/types/WaitlistPage"
import tinycolor from "tinycolor2"

export default function SignupForm({
  primaryColor,
  secondaryColor,
  textColor,
  accentColor,
  fields,
}: {
  primaryColor: string
  secondaryColor: string
  textColor: string
  accentColor: string
  fields: Field[]
}) {
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
      >
        Join waitlist
      </button>
    </div>
  )
}
