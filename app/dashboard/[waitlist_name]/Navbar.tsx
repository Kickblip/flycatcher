import Link from "next/link"
import Image from "next/image"
import UserButton from "@/components/shared/UserButton"
import { WaitlistPage } from "@/types/WaitlistPage"

function Navbar({ waitlist }: { waitlist: WaitlistPage }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:space-x-10 space-x-6">
          <Link href="/dashboard/home">
            <Image src="/landing/logo.png" alt="Logo" width={170} height={170} />
          </Link>
          <div className="rounded border py-2 px-6">
            <p className="text-black text-md font-medium">{waitlist.name}</p>
          </div>
          <Link
            href={`/dashboard/${waitlist.urlName}/customize`}
            className="text-black text-md font-medium opacity-70 hover:opacity-100 transition duration-200"
          >
            customize
          </Link>
          <Link
            href={`/dashboard/${waitlist.urlName}/contacts`}
            className="text-black text-md font-medium opacity-70 hover:opacity-100 transition duration-200"
          >
            contacts
          </Link>
          <Link
            href={`/dashboard/${waitlist.urlName}/analytics`}
            className="text-black text-md font-medium opacity-70 hover:opacity-100 transition duration-200"
          >
            analytics
          </Link>
        </div>
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
