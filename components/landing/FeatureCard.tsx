import React from "react"
import { IconType } from "react-icons/lib"

export default function FeatureCard({ title, content, FeatureIcon }: { title: string; content: string; FeatureIcon: IconType }) {
  return (
    <div className="max-w-sm p-10 w-80 h-80 bg-white shadow hover:shadow-lg transition duration-200 rounded border">
      <div className="flex flex-col items-start space-y-4">
        <FeatureIcon className="w-12 h-12 text-redorange-500" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  )
}
