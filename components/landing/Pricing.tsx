import { FaCheck } from "react-icons/fa6"
import Link from "next/link"
import PricingCard from "./PricingCard"

export default function Pricing() {
  const freeFeatures = ["50 contacts", "Full customization options", "Analytics dashboard"]

  return (
    <section className="w-full flex flex-col my-32">
      <h2 className="text-5xl font-semibold mb-6 text-center">Transparent Pricing</h2>
      <div className="w-full flex flex-col md:flex-row space-x-4 items-center justify-center">
        <div className="w-[22rem] p-1">
          <div className="border h-[26rem] shadow hover:shadow-lg transition duration-200 rounded">
            <div className="p-4">
              <h3 className="text-3xl font-semibold my-2">Free</h3>
              <p className="text-sm font-normal text-gray-600">Essential features to get started</p>
              <p className="text-5xl font-semibold my-6">
                $0
                <span className="text-sm font-normal text-gray-600">/month</span>
              </p>
              <Link
                href="/dashboard/home"
                className="block w-full text-center transition duration-200 font-semibold py-2 px-4 rounded border border-redorange-500 text-redorange-500 hover:bg-redorange-500 hover:text-white hover:bg-redorange-300"
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
          </div>
        </div>
        <PricingCard
          title="Growth"
          price="$20"
          description="Additional features to start marketing"
          features={["Unlimited contacts", "10,000 emails / month", "Remove Flycatcher branding"]}
        />
        {/* <PricingCard
          title="Scale"
          price="$35"
          description="Higher limits for exploding products"
          features={["Everything in Growth", "40,000 emails / month"]}
        /> */}
        <div className="w-[22rem] p-1">
          <div className="border h-[26rem] shadow hover:shadow-lg transition duration-200 rounded flex flex-col justify-center items-center">
            <div className="p-4 text-center">
              <h3 className="text-3xl font-semibold mb-1">Need more emails?</h3>
              <p className="text-md font-normal text-gray-600 mb-6 w-full break-words">Let&apos;s make it happen</p>
              <Link
                href="/dashboard/home"
                className="w-full block text-center transition duration-200 font-semibold py-2 px-4 rounded border border-redorange-500 text-redorange-500 hover:bg-redorange-500 hover:text-white"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
