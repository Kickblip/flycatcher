import { CheckCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

function Pricing() {
  const freeFeatures = ["Unlimited users", "Kanban view", "Custom logos", "Custom color palettes"]
  const paidFeatures = ["Unlimited posts", "Up to 10 feedback boards", "Custom metadata", "Remove Flycatcher branding"]

  return (
    <section className="w-full flex flex-col my-32">
      <h2 className="text-5xl font-semibold mb-6 text-center">Pricing</h2>
      <div className="w-full flex flex-col md:flex-row items-center justify-center">
        <div className="w-[26rem] p-4">
          <div className="bg-gray-50 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-3xl font-semibold mb-2">Free</h3>
              <p className="text-sm font-normal text-gray-500 mb-4">Essential features to set up your feedback board</p>
              <p className="text-5xl font-semibold mb-4">
                $0
                <span className="text-sm font-normal text-gray-600">/month</span>
              </p>
              <Link
                href="/dashboard/subscription"
                className="block w-full text-center transition duration-200 font-semibold py-2 px-4 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600"
              >
                Get Started
              </Link>
              <p className="text-lg font-medium my-4">What you get:</p>
              <ul className="mb-4 space-y-3">
                {freeFeatures.map((feature, index) => (
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
        <div className="w-[26rem] p-4">
          <div className="bg-gray-50 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-3xl font-semibold mb-2">Growth</h3>
              <p className="text-sm font-normal text-gray-500 mb-4">More feedback and additional features</p>
              <p className="text-5xl font-semibold mb-4">
                $10
                <span className="text-sm font-normal text-gray-600">/month</span>
              </p>
              <Link
                href="/dashboard/subscription"
                className="block w-full text-center transition duration-200 font-semibold py-2 px-4 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600"
              >
                Get Started
              </Link>
              <p className="text-lg font-medium my-4">What you get:</p>
              <ul className="mb-4 space-y-3">
                {paidFeatures.map((feature, index) => (
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
      </div>
    </section>
  )
}

export default Pricing
