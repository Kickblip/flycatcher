import Link from "next/link"
import Image from "next/image"
import UserButton from "@/components/shared/UserButton"
import FullLogo from "@/components/shared/FullLogo"

function Navbar() {
  return (
    <nav className="w-full m-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center md:space-x-10 space-x-6">
            <Link href="/dashboard/home">
              <FullLogo />
            </Link>
            <Link
              href="/dashboard/subscription"
              className="text-black text-md font-medium opacity-70 hover:opacity-100 transition duration-200"
            >
              Subscription
            </Link>
          </div>
          <div className="flex items-center">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
