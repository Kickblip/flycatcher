import Link from "next/link"
import FullLogo from "@/components/shared/FullLogo"

export default function NotFound404() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full text-center">
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
        <FullLogo />
        <h1 className="text-7xl font-bold text-black my-4">404</h1>
        <p className="text-2xl text-black opacity-70 mb-8">Page Not Found</p>

        <Link href="/" className="text-blue-500 hover:underline text-lg">
          Back to safety
        </Link>
      </div>
    </main>
  )
}
