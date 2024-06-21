import Link from "next/link"
import Image from "next/image"
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function NotFound404() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full text-center">
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
        <Image src="/landing/logo.png" alt="Logo" width={200} height={200} className="mb-4" />
        <h1 className="text-7xl font-bold text-black mb-4">404</h1>
        <p className="text-2xl text-black opacity-70 mb-8">Page Not Found</p>
        <SignedIn>
          <Link href="/dashboard/boards" className="text-blue-500 hover:underline text-lg">
            Back to safety
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href="/" className="text-blue-500 hover:underline text-lg">
            Back to safety
          </Link>
        </SignedOut>
      </div>
    </main>
  )
}
