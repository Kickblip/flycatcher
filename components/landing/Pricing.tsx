import { FaCheck } from "react-icons/fa6"
import Link from "next/link"

export default function Pricing() {
  const freeFeatures = ["50 contacts", "Full customization options", "Analytics dashboard"]
  const growthFeatures = ["Unlimited contacts", "10,000 emails / month", "Remove Flycatcher branding"]

  return (
    <section className="w-full flex flex-col my-32 p-1 md:p-0">
      <h2 className="text-5xl font-semibold mb-12 text-center">Transparent Pricing</h2>
      <div className="w-full flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 items-center justify-center">
        <div className="w-full sm:w-80 p-4 border h-[26rem] shadow hover:shadow-lg transition duration-200 rounded">
          <h3 className="text-3xl font-semibold my-2">Free</h3>
          <p className="text-sm font-normal text-gray-600">Essential features to get started</p>
          <p className="text-5xl font-semibold my-6">
            $0
            <span className="text-sm font-normal text-gray-600">/month</span>
          </p>
          <Link
            href="/dashboard/home"
            className="block w-full text-center transition duration-200 font-semibold py-2 px-4 rounded text-white bg-redorange-500 hover:bg-redorange-300"
          >
            Create your first waitlist
          </Link>
          <p className="text-lg font-medium mb-4 mt-6">What you get:</p>
          <ul className="mb-4 space-y-3">
            {freeFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaCheck className="h-4 w-4 text-redorange-500" />
                <li key={index} className="text-sm font-normal text-gray-600">
                  {feature}
                </li>
              </div>
            ))}
          </ul>
        </div>

        <div className="h-[26rem] w-full sm:w-96 p-4 text-white bg-redorange-500 shadow hover:shadow-lg transition duration-200 rounded">
          <h3 className="text-3xl font-semibold my-2">Growth</h3>
          <p className="text-sm font-normal text-gray-200">Additional features to start marketing</p>
          <p className="text-5xl font-semibold my-6">
            $20
            <span className="text-sm font-normal text-gray-200">/month</span>
          </p>
          <Link
            href="/dashboard/subscription"
            className="block w-full text-center font-semibold py-2 px-4 rounded bg-white text-redorange-500"
          >
            Create an account
          </Link>
          <p className="text-lg font-medium mb-4 mt-6">What you get:</p>
          <ul className="mb-4 space-y-3">
            {growthFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FaCheck className="h-4 w-4 text-white" />
                <li key={index} className="text-sm font-normal text-gray-200">
                  {feature}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center text-center w-full mt-8">
        <p className="text-gray-600">Need to send more emails? Contact us at flycatcherapp@gmail.com</p>
      </div>
    </section>
  )
}
