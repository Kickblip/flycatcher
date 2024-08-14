import Link from "next/link"
import { FaCheck } from "react-icons/fa6"

export default function PricingCard({
  title,
  price,
  description,
  features,
}: {
  title: string
  price: string
  description: string
  features: string[]
}) {
  return (
    <div className="w-[22rem] p-1">
      <div className="border h-[26rem] shadow hover:shadow-lg transition-duration-200 rounded">
        <div className="p-4">
          <h3 className="text-3xl font-semibold my-2">{title}</h3>
          <p className="text-sm font-normal text-gray-600">{description}</p>
          <p className="text-5xl font-semibold my-6">
            {price}
            <span className="text-sm font-normal text-gray-600">/month</span>
          </p>
          <Link
            href="/dashboard/subscription"
            className="block w-full text-center transition duration-200 font-semibold py-2 px-4 rounded border border-redorange-500 hover:border-redorange-300 bg-redorange-500 text-white hover:bg-redorange-300"
          >
            Create an account
          </Link>
          <p className="text-lg font-medium mb-4 mt-6">What you get:</p>
          <ul className="mb-4 space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaCheck className="h-4 w-4 text-redorange-500" />
                <li className="text-sm font-normal text-gray-600">{feature}</li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
