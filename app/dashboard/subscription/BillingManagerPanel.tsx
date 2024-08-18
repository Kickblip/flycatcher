import Link from "next/link"
import Image from "next/image"

export default function BillingManagerPanel({
  avatarUrl,
  displayName,
  email,
}: {
  avatarUrl: string
  displayName: string
  email: string
}) {
  return (
    <div className="w-96 border rounded flex flex-col items-start p-4">
      <Image src={avatarUrl} alt="Profile Picture" className="rounded-full object-cover w-16 h-16" width={500} height={500} />
      <div className="mt-2">
        <p className="text-xl font-semibold">{displayName}</p>
        <p className="text-sm font-normal text-gray-500">{email}</p>
      </div>
      <Link
        href={process.env.NEXT_PUBLIC_STRIPE_BILLING_URL as string}
        target="_blank"
        className="bg-redorange-500 rounded text-white px-4 py-1.5 hover:bg-redorange-300 transition duration-200 mt-4"
      >
        Manage Billing
      </Link>
    </div>
  )
}
