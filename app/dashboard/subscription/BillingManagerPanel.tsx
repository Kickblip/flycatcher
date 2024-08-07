import Link from "next/link"

export default function BillingManagerPanel() {
  return (
    <div className="w-full h-32 flex flex-col">
      <div className="flex items-center mt-4">
        <Link
          href={process.env.NEXT_PUBLIC_STRIPE_BILLING_URL as string}
          target="_blank"
          className="bg-indigo-500 rounded text-white px-4 py-1.5 hover:bg-indigo-600 transition duration-200"
        >
          Manage Billing
        </Link>
      </div>
    </div>
  )
}
