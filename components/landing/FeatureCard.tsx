import React from "react"
import { IconType } from "react-icons/lib"

export default function FeatureCard({ title, content, FeatureIcon }: { title: string; content: string; FeatureIcon: IconType }) {
  return (
    <div className="p-6 md:p-10 w-full md:w-80 h-50 md:h-80 bg-white shadow hover:shadow-lg transition duration-200 rounded border">
      <div className="flex flex-col items-start space-y-3 md:space-y-6">
        <FeatureIcon className="w-8 md:w-12 h-8 md:h-12 text-redorange-500" />
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-800">{content}</p>
        </div>
      </div>
    </div>
  )
}
