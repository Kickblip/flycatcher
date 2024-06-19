import Link from "next/link"
import Image from "next/image"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

function Navbar() {
  return (
    <nav className="w-full m-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link href="/">
              <Image src="/landing/logo.png" alt="Logo" width={170} height={170} />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link href="/dashboard/home">
                <div className="text-black px-4 py-2 rounded text-md mr-2 hover:underline">Dashboard</div>
              </Link>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/dashboard/home">
                <div className="bg-black text-white px-4 py-2 rounded text-md">Log In</div>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
