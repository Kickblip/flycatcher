import Link from "next/link"
import Image from "next/image"
import { SignedIn, UserButton } from "@clerk/nextjs"

function Navbar() {
  return (
    <nav className="w-full m-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link href="/dashboard/boards">
              <Image src="/landing/logo.png" alt="Logo" width={170} height={170} />
            </Link>
            <Link
              href="/dashboard/boards"
              className="text-black text-md font-medium opacity-70 hover:opacity-100 transition duration-200"
            >
              Boards
            </Link>
            <Link
              href="/dashboard/subscription"
              className="text-black text-md font-medium opacity-70 hover:opacity-100 transition duration-200"
            >
              Subscription
            </Link>
          </div>
          <div className="flex items-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
